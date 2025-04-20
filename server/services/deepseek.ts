import { RecipeResult } from './openai';
import fetch from 'node-fetch';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const API_URL = "https://api.deepseek.com/v1/chat/completions";

/**
 * Generate recipes based on provided ingredients using DeepSeek AI
 */
export async function generateRecipesDeepSeek(ingredients: string[]): Promise<RecipeResult> {
  try {
    if (!DEEPSEEK_API_KEY) {
      console.warn("DeepSeek API key is missing, using fallback data");
      return getFallbackRecipes(ingredients);
    }

    const joinedIngredients = ingredients.join(", ");
    
    const prompt = `
    أنا طباخ محترف. أحتاج وصفات سهلة وسريعة باستخدام المكونات المتوفرة فقط.

    المكونات المتوفرة: ${joinedIngredients}

    قم بإنشاء ٣ وصفات مختلفة أو أقل حسب المكونات المتوفرة، واشرح كل وصفة بإيجاز.
    
    أيضاً، اقترح ٥ مكونات إضافية يمكن إضافتها للحصول على وصفات أكثر تنوعاً.

    أريد النتيجة بتنسيق JSON بالشكل التالي فقط:
    {
      "recipes": [
        {
          "title": "عنوان الوصفة",
          "description": "وصف موجز للوصفة",
          "ingredients": ["المكون 1", "المكون 2", ...],
          "instructions": ["الخطوة 1", "الخطوة 2", ...]
        }
      ],
      "suggestedIngredients": ["مكون مقترح 1", "مكون مقترح 2", ...]
    }

    إذا لم تكن المكونات كافية، أرجع مصفوفة recipes فارغة واقترح مكونات إضافية فقط.
    `;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("DeepSeek API Error:", errorData);
        throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content || "{}");
      
      return {
        recipes: result.recipes || [],
        suggestedIngredients: result.suggestedIngredients || [],
      };
    } catch (apiError: any) {
      console.error("DeepSeek API Error:", apiError);
      
      // Handle API errors
      return getFallbackRecipes(ingredients);
    }
  } catch (error) {
    console.error("General Error in generateRecipesDeepSeek:", error);
    return getFallbackRecipes(ingredients);
  }
}

// Define recipe data type for type safety
type RecipeData = {
  [key: string]: RecipeResult;
};

// Fallback data for when API fails
const fallbackRecipes: RecipeData = {
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
  }
};

/**
 * Get fallback recipes when API is unavailable
 */
function getFallbackRecipes(ingredients: string[]): RecipeResult {
  // Create a normalized key from ingredients
  const key = ingredients
    .map(i => i.trim().toLowerCase())
    .sort()
    .join(',');
  
  // Check if we have a direct match in our fallback data
  if (fallbackRecipes[key]) {
    return fallbackRecipes[key];
  }
  
  // Check if any of our fallback keys is a subset of the provided ingredients
  for (const [fallbackKey, recipes] of Object.entries(fallbackRecipes)) {
    const fallbackIngredients = fallbackKey.split(',');
    if (fallbackIngredients.every(ing => ingredients.some(i => 
      i.trim().toLowerCase().includes(ing) || ing.includes(i.trim().toLowerCase())
    ))) {
      return recipes;
    }
  }
  
  // If no match, return a generic suggestion
  return {
    recipes: [],
    suggestedIngredients: [
      "طماطم", "بصل", "ثوم", "بطاطس", "جزر", 
      "دجاج", "لحم", "بيض", "أرز", "معكرونة"
    ]
  };
}