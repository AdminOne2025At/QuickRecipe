/**
 * خدمة للتحقق من محتوى المنشورات والتعليقات
 * تستخدم خدمات الذكاء الاصطناعي للكشف عن المحتوى غير اللائق
 */

import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// إعداد OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// إعداد Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });
const geminiVisionModel = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

/**
 * واجهة لنتيجة التحقق من المحتوى
 */
export interface ContentModerationResult {
  isAppropriate: boolean;
  reason?: string;
  confidence?: number;
  moderatedContent?: string; // إذا كان المحتوى غير لائق، يمكن تقديم نسخة معدلة
}

/**
 * فحص نص للتحقق من خلوه من المحتوى غير اللائق
 * @param text النص المراد فحصه
 * @returns نتيجة التحقق
 */
export async function moderateText(text: string): Promise<ContentModerationResult> {
  try {
    if (!text || text.trim().length === 0) {
      return { isAppropriate: true };
    }

    // استخدام OpenAI للتحقق من المحتوى
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `أنت مشرف على المحتوى لموقع وصفات طعام. مهمتك هي تحديد ما إذا كان النص يحتوي على محتوى غير لائق أو مسيء.
          
          قواعد التحقق:
          1. يجب أن يكون المحتوى مناسبًا لجميع الأعمار
          2. يجب حظر أي محتوى إباحي أو جنسي
          3. يجب حظر الإساءات والشتائم
          4. يجب حظر خطاب الكراهية والتمييز
          5. يجب حظر العنف الشديد
          
          قم بتقييم النص المقدم وأعد النتيجة بتنسيق JSON يحتوي على:
          - isAppropriate: منطقي (صح أو خطأ)
          - reason: سبب الرفض إذا كان المحتوى غير مناسب (سلسلة نصية)
          - confidence: مستوى الثقة (رقم من 0 إلى 1)
          - moderatedContent: نسخة معدلة من النص إذا كان يحتوي على كلمات غير لائقة (سلسلة نصية، اختياري)`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    // تحليل الاستجابة
    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      isAppropriate: result.isAppropriate === true,
      reason: result.reason,
      confidence: result.confidence,
      moderatedContent: result.moderatedContent
    };
  } catch (error) {
    console.error("Error moderating text content:", error);
    // في حالة الخطأ، نسمح بالمحتوى مع تسجيل الخطأ
    return { isAppropriate: true };
  }
}

/**
 * فحص URL صورة للتحقق من خلوها من المحتوى غير اللائق
 * @param imageUrl رابط الصورة المراد فحصها
 * @returns نتيجة التحقق
 */
export async function moderateImage(imageUrl: string): Promise<ContentModerationResult> {
  try {
    if (!imageUrl || imageUrl.trim().length === 0) {
      return { isAppropriate: true };
    }

    // متغيرات لتخزين نتيجة التحقق من الصورة
    let isAppropriate = true;
    let reason = "";
    let confidence = 0.95;

    // للحصول على المحتوى الثنائي من URL
    const fetchImageData = async (url: string): Promise<string | null> => {
      try {
        // التعامل مع URLs المختلفة
        let imageData: string | null = null;
        
        if (url.startsWith('data:')) {
          // إذا كان URL بصيغة data URL
          imageData = url.split(',')[1];
        } else {
          // إذا كان URL عاديًا، نقوم بجلب البيانات
          const response = await fetch(url);
          const buffer = await response.arrayBuffer();
          imageData = Buffer.from(buffer).toString('base64');
        }
        
        return imageData;
      } catch (error) {
        console.error("Error fetching image data:", error);
        return null;
      }
    };

    // الحصول على بيانات الصورة بتنسيق Base64
    const imageData = await fetchImageData(imageUrl);
    
    if (!imageData) {
      return { 
        isAppropriate: false, 
        reason: "تعذر تحميل الصورة للتحقق منها. يرجى استخدام رابط صورة صالح.",
        confidence: 1
      };
    }

    // استخدام Google Gemini للتحقق من الصورة
    const imagePrompt = `
      أنت أداة تحقق من محتوى الصور لموقع وصفات طعام. مهمتك تحليل الصورة المقدمة وتحديد ما إذا كانت مناسبة للجميع:
      
      قواعد التحقق:
      1. يجب أن يكون المحتوى مناسبًا لجميع الأعمار
      2. يجب حظر أي محتوى إباحي أو جنسي
      3. يجب حظر العنف الشديد أو الدماء
      4. يجب أن تكون الصورة مرتبطة بالطعام أو الطبخ أو النشاطات العائلية المناسبة
      
      أعد النتيجة بتنسيق JSON التالي فقط:
      {
        "isAppropriate": boolean, // هل الصورة مناسبة أم لا
        "reason": string, // سبب الرفض إذا كان المحتوى غير مناسب، أو فارغ إذا كان مناسبًا
        "confidence": number // مستوى الثقة من 0 إلى 1
      }
      
      لا تضف أي نص آخر غير كائن JSON المطلوب.
    `;

    const result = await geminiVisionModel.generateContent([
      imagePrompt,
      { inlineData: { data: imageData, mimeType: "image/jpeg" } }
    ]);

    const response = result.response;
    const text = response.text();

    try {
      // محاولة تحليل JSON مباشرة
      const jsonResult = JSON.parse(text);
      return {
        isAppropriate: jsonResult.isAppropriate === true,
        reason: jsonResult.reason,
        confidence: jsonResult.confidence
      };
    } catch (parseError) {
      // إذا فشل التحليل المباشر، نحاول استخراج JSON من النص
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const extractedJson = JSON.parse(jsonMatch[0]);
          return {
            isAppropriate: extractedJson.isAppropriate === true,
            reason: extractedJson.reason,
            confidence: extractedJson.confidence
          };
        } catch (extractError) {
          console.error("Error parsing extracted JSON:", extractError);
        }
      }
      
      // إذا لم ننجح في استخراج JSON صالح، نقوم بتحليل النص يدويًا
      if (text.toLowerCase().includes("inappropriate") || 
          text.toLowerCase().includes("غير مناسب") || 
          text.toLowerCase().includes("إباحي") || 
          text.toLowerCase().includes("عنف")) {
        isAppropriate = false;
        reason = "الصورة تحتوي على محتوى غير مناسب حسب التحليل النصي";
        confidence = 0.7;
      }
      
      return { isAppropriate, reason, confidence };
    }
  } catch (error) {
    console.error("Error moderating image content:", error);
    // في حالة الخطأ، نسمح بالصورة مع تسجيل الخطأ لكن نضع ملاحظة
    return { 
      isAppropriate: true,
      reason: "حدث خطأ أثناء التحقق من الصورة، ولكن تم السماح بها. يرجى مراجعة المحتوى يدويًا إذا لزم الأمر.",
      confidence: 0.5
    };
  }
}

/**
 * فحص محتوى كامل للمنشور (نص وصورة إذا وجدت)
 * @param content محتوى المنشور النصي
 * @param title عنوان المنشور
 * @param imageUrl رابط الصورة (اختياري)
 * @returns نتيجة التحقق
 */
export async function moderateContent(
  content: string, 
  title: string, 
  imageUrl?: string
): Promise<ContentModerationResult> {
  // فحص النص أولاً (المحتوى والعنوان)
  const combinedText = `العنوان: ${title}\nالمحتوى: ${content}`;
  const textResult = await moderateText(combinedText);

  // إذا كان النص غير مناسب، نرفض المحتوى مباشرة
  if (!textResult.isAppropriate) {
    return textResult;
  }

  // إذا كانت هناك صورة، نفحصها أيضاً
  if (imageUrl) {
    const imageResult = await moderateImage(imageUrl);
    if (!imageResult.isAppropriate) {
      return imageResult;
    }
  }

  // إذا وصلنا إلى هنا، فالمحتوى مناسب
  return { isAppropriate: true };
}

/**
 * فحص تعليق للتحقق من خلوه من المحتوى غير اللائق
 * @param commentText نص التعليق
 * @returns نتيجة التحقق
 */
export async function moderateComment(commentText: string): Promise<ContentModerationResult> {
  return await moderateText(commentText);
}