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

    // استخدام Google Gemini للتحقق من الصورة
    const imagePrompt = `
      تحليل الصورة والتحقق من محتواها:
      1. هل تحتوي الصورة على محتوى غير لائق أو مسيء؟
      2. هل تحتوي الصورة على محتوى إباحي أو جنسي؟
      3. هل تحتوي الصورة على عنف أو دماء أو أذى؟
      4. هل هذه الصورة مناسبة لتطبيق وصفات طعام عائلي؟

      أعد النتيجة بتنسيق JSON التالي فقط:
      {
        "isAppropriate": boolean,
        "reason": string (سبب الرفض إذا كان المحتوى غير مناسب، أو فارغ إذا كان مناسبًا),
        "confidence": number (من 0 إلى 1)
      }
    `;

    const result = await geminiVisionModel.generateContent([
      imagePrompt,
      { inlineData: { data: imageUrl, mimeType: "image/jpeg" } }
    ]);

    const response = result.response;
    const text = response.text();

    // استخراج JSON من النص
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const jsonResult = JSON.parse(jsonMatch[0]);
      return {
        isAppropriate: jsonResult.isAppropriate === true,
        reason: jsonResult.reason,
        confidence: jsonResult.confidence
      };
    }

    // إذا لم يتم العثور على JSON، نفترض أن الصورة مناسبة
    return { isAppropriate: true };
  } catch (error) {
    console.error("Error moderating image content:", error);
    // في حالة الخطأ، نسمح بالصورة مع تسجيل الخطأ
    return { isAppropriate: true };
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