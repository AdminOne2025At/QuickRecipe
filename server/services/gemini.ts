import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { RecipeResult } from './openai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Gemini model to use - using the most capable model
const MODEL_NAME = "gemini-1.5-pro";

interface GeminiRecipeResponse {
  recipes: {
    title: string;
    description: string;
    ingredients: string[];
    instructions: string[];
  }[];
  suggestedIngredients: string[];
}

/**
 * Generate recipes based on provided ingredients using Google Gemini API
 */
export async function generateRecipesGemini(ingredients: string[]): Promise<RecipeResult> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable not set");
    }

    // If no ingredients provided, return empty results with suggestions
    if (ingredients.length === 0) {
      return {
        recipes: [],
        suggestedIngredients: [
          "دجاج", "لحم", "سمك", "بطاطس", "أرز", 
          "معكرونة", "بصل", "طماطم", "بيض", "جبنة"
        ]
      };
    }

    // Create prompt for Gemini
    const userIngredients = ingredients.join(', ');
    
    const prompt = `
    أريد منك أن تقترح لي وصفات طبخ باستخدام المكونات التالية: ${userIngredients}.
    
    مطلوب النتائج باللغة العربية، وأريد منك توليد وصفتين مختلفتين بالصيغة التالية:
    
    أولاً، اقترح قائمة بـ 5 مكونات إضافية قد ترغب بإضافتها لتوسيع الخيارات.
    
    ثم لكل وصفة: 
    1. عنوان الوصفة
    2. وصف موجز (1-2 جملة)
    3. قائمة المكونات (مع الكميات)
    4. خطوات التحضير مقسمة إلى نقاط واضحة
    
    إليك مثال للصيغة المطلوبة، لكني أريد الرد منك بصيغة JSON بدون أي نص إضافي:
    
    {
      "recipes": [
        {
          "title": "عنوان الوصفة الأولى",
          "description": "وصف موجز للوصفة الأولى",
          "ingredients": ["المكون 1 مع الكمية", "المكون 2 مع الكمية"],
          "instructions": ["الخطوة 1", "الخطوة 2", "الخطوة 3"]
        },
        {
          "title": "عنوان الوصفة الثانية",
          "description": "وصف موجز للوصفة الثانية",
          "ingredients": ["المكون 1 مع الكمية", "المكون 2 مع الكمية"],
          "instructions": ["الخطوة 1", "الخطوة 2", "الخطوة 3"]
        }
      ],
      "suggestedIngredients": ["مكون إضافي 1", "مكون إضافي 2", "مكون إضافي 3", "مكون إضافي 4", "مكون إضافي 5"]
    }
    `;

    // Get the Gemini model
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
      },
    });

    // Generate content
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    // Process response
    const response = result.response;
    const textResponse = response.text();
    
    console.log("Gemini API response:", textResponse);

    // Parse the JSON response
    let parsedResponse: GeminiRecipeResponse;
    try {
      // Since the response might sometimes have additional text before/after the JSON,
      // we'll try to extract the JSON part
      const jsonMatch = textResponse.match(/{[\s\S]*}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No valid JSON found in response");
      }
    } catch (error) {
      console.error("Failed to parse Gemini API response:", error);
      return getFallbackRecipes(ingredients);
    }

    // Format the response to match our expected format
    return {
      recipes: parsedResponse.recipes.map(recipe => ({
        title: recipe.title,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
      })),
      suggestedIngredients: parsedResponse.suggestedIngredients || [
        "دجاج", "لحم", "سمك", "بطاطس", "أرز", 
        "معكرونة", "بصل", "طماطم", "بيض", "جبنة"
      ],
    };
  } catch (error) {
    console.error("Error generating recipes with Gemini:", error);
    return getFallbackRecipes(ingredients);
  }
}

/**
 * Get fallback recipes when API is unavailable
 */
function getFallbackRecipes(ingredients: string[]): RecipeResult {
  // Define some fallback recipes by ingredients
  const fallbackRecipes: Record<string, RecipeResult> = {
    "طماطم,بصل,ثوم": {
      recipes: [
        {
          title: "صلصة طماطم مع البصل والثوم",
          description: "صلصة طماطم بسيطة وسريعة يمكن استخدامها مع المعكرونة أو الأرز",
          ingredients: ["3 حبات طماطم", "1 بصلة متوسطة", "2 فص ثوم", "ملح وفلفل حسب الرغبة", "زيت زيتون"],
          instructions: [
            "قطع البصل والثوم إلى قطع صغيرة",
            "سخن زيت الزيتون في مقلاة على نار متوسطة",
            "أضف البصل والثوم وقلبهم حتى يصبح لونهم ذهبياً",
            "قطع الطماطم وأضفها إلى المقلاة",
            "أضف الملح والفلفل واتركها على نار هادئة لمدة 15 دقيقة"
          ]
        }
      ],
      suggestedIngredients: ["فلفل أخضر", "زيتون", "معكرونة", "جبنة", "أعشاب (ريحان أو بقدونس)"]
    },
    "بيض": {
      recipes: [
        {
          title: "بيض مقلي",
          description: "وجبة سريعة من البيض المقلي",
          ingredients: ["2 بيضة", "ملح وفلفل حسب الرغبة", "زيت للقلي"],
          instructions: [
            "سخن الزيت في مقلاة على نار متوسطة",
            "اكسر البيض في المقلاة",
            "رش الملح والفلفل",
            "اطهي البيض حتى ينضج حسب الرغبة"
          ]
        }
      ],
      suggestedIngredients: ["جبنة", "خبز", "طماطم", "بصل", "فلفل أخضر"]
    },
    "دجاج": {
      recipes: [
        {
          title: "دجاج مشوي بالأعشاب",
          description: "طبق دجاج مشوي لذيذ بتتبيلة الأعشاب",
          ingredients: ["4 قطع دجاج", "2 ملعقة زيت زيتون", "2 فص ثوم مفروم", "1 ملعقة أوريغانو", "ملح وفلفل حسب الرغبة", "عصير ليمون"],
          instructions: [
            "اخلط الزيت والثوم والأعشاب والملح والفلفل وعصير الليمون في وعاء",
            "ضع قطع الدجاج في التتبيلة وغطها جيدًا",
            "اترك الدجاج في التتبيلة لمدة 30 دقيقة على الأقل",
            "سخن الفرن إلى 200 درجة مئوية",
            "ضع الدجاج في صينية الخبز واشويه لمدة 30-35 دقيقة حتى ينضج تمامًا"
          ]
        }
      ],
      suggestedIngredients: ["بطاطس", "أرز", "ليمون", "بصل", "زيت زيتون"]
    }
  };

  // Use same logic as before
  const normalizedIngredients = ingredients.map(i => i.trim().toLowerCase());
  const key = [...normalizedIngredients].sort().join(',');
  
  if (key in fallbackRecipes) {
    return fallbackRecipes[key];
  }

  // Check for partial matches
  for (const ingredient of normalizedIngredients) {
    if (ingredient in fallbackRecipes) {
      return fallbackRecipes[ingredient];
    }
  }

  // Return a generic suggestion if no match found
  return {
    recipes: [],
    suggestedIngredients: [
      "دجاج", "لحم", "سمك", "بطاطس", "أرز", "معكرونة", "بصل", "طماطم", "بيض", "جبنة"
    ]
  };
}