import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || "",
});

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user

export interface RecipeResult {
  recipes: {
    title: string;
    description: string;
    ingredients: string[];
    instructions: string[];
  }[];
  suggestedIngredients: string[];
}

/**
 * Generate recipes based on provided ingredients using OpenAI
 */
export async function generateRecipes(ingredients: string[]): Promise<RecipeResult> {
  try {
    if (!openai.apiKey) {
      throw new Error("OpenAI API key is missing");
    }

    const joinedIngredients = ingredients.join(", ");
    
    const prompt = `
    أنا طباخ محترف. أحتاج وصفات سهلة وسريعة باستخدام المكونات المتوفرة فقط.

    المكونات المتوفرة: ${joinedIngredients}

    قم بإنشاء ٣ وصفات مختلفة أو أقل حسب المكونات المتوفرة، واشرح كل وصفة بإيجاز.
    
    أيضاً، اقترح ٥ مكونات إضافية يمكن إضافتها للحصول على وصفات أكثر تنوعاً.

    أريد النتيجة بتنسيق JSON بالشكل التالي:
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

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      recipes: result.recipes || [],
      suggestedIngredients: result.suggestedIngredients || [],
    };
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to generate recipes");
  }
}
