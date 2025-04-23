/**
 * Service to handle ingredient substitution recommendations
 */

import { RecipeResult } from "./openai";

// Define the structure of a substitution response
export interface SubstitutionResponse {
  originalIngredient: string;
  substitutes: {
    name: string;
    ratio: string;
    notes?: string;
  }[];
}

// Arabic substitution data
const arabicSubstitutions: Record<string, SubstitutionResponse> = {
  "دقيق": {
    originalIngredient: "دقيق أبيض",
    substitutes: [
      { 
        name: "دقيق القمح الكامل", 
        ratio: "1:1", 
        notes: "سيجعل الطعام أكثر كثافة وسيعطي نكهة أقوى"
      },
      { 
        name: "دقيق اللوز", 
        ratio: "1:1", 
        notes: "خيار منخفض الكربوهيدرات، مناسب للأطعمة الخالية من الغلوتين"
      },
      { 
        name: "دقيق الذرة", 
        ratio: "3/4 كوب دقيق ذرة لكل كوب دقيق", 
        notes: "مناسب للخبز والتكثيف" 
      }
    ]
  },
  "سكر": {
    originalIngredient: "سكر أبيض",
    substitutes: [
      { 
        name: "عسل", 
        ratio: "3/4 كوب عسل لكل كوب سكر", 
        notes: "قلل السوائل الأخرى بمقدار 1/4 كوب لكل كوب عسل" 
      },
      { 
        name: "سكر جوز الهند", 
        ratio: "1:1" 
      },
      { 
        name: "شراب القيقب", 
        ratio: "3/4 كوب شراب لكل كوب سكر", 
        notes: "قلل السوائل الأخرى قليلاً" 
      }
    ]
  },
  "زبدة": {
    originalIngredient: "زبدة",
    substitutes: [
      { 
        name: "زيت جوز الهند", 
        ratio: "1:1", 
        notes: "جيد للخبز، يعمل بشكل أفضل عند درجة حرارة الغرفة" 
      },
      { 
        name: "زيت الزيتون", 
        ratio: "3/4 كوب زيت لكل كوب زبدة", 
        notes: "أفضل للوصفات المالحة" 
      },
      { 
        name: "صلصة التفاح", 
        ratio: "1/2 كوب صلصة تفاح لكل كوب زبدة", 
        notes: "لتقليل الدهون في المخبوزات" 
      }
    ]
  },
  "بيض": {
    originalIngredient: "بيض",
    substitutes: [
      { 
        name: "بذور الكتان المطحونة + ماء", 
        ratio: "1 ملعقة كبيرة بذور كتان + 3 ملاعق ماء = بيضة واحدة", 
        notes: "اتركها لمدة 5 دقائق حتى تتكاثف" 
      },
      { 
        name: "موز مهروس", 
        ratio: "1/4 كوب موز مهروس = بيضة واحدة", 
        notes: "مناسب للمخبوزات الحلوة" 
      },
      { 
        name: "الزبادي", 
        ratio: "1/4 كوب زبادي = بيضة واحدة" 
      }
    ]
  },
  "حليب": {
    originalIngredient: "حليب",
    substitutes: [
      { 
        name: "حليب اللوز", 
        ratio: "1:1" 
      },
      { 
        name: "حليب جوز الهند", 
        ratio: "1:1", 
        notes: "يضيف نكهة جوز الهند" 
      },
      { 
        name: "حليب الصويا", 
        ratio: "1:1", 
        notes: "بديل نباتي شائع" 
      }
    ]
  },
  "زيت زيتون": {
    originalIngredient: "زيت زيتون",
    substitutes: [
      { 
        name: "زيت الكانولا", 
        ratio: "1:1", 
        notes: "نكهة أخف" 
      },
      { 
        name: "زيت الأفوكادو", 
        ratio: "1:1", 
        notes: "خيار صحي مع نقطة دخان عالية" 
      },
      { 
        name: "زيت جوز الهند", 
        ratio: "1:1", 
        notes: "يضيف نكهة جوز الهند" 
      }
    ]
  },
  "خل": {
    originalIngredient: "خل أبيض",
    substitutes: [
      { 
        name: "عصير ليمون", 
        ratio: "1:1", 
        notes: "يعطي حموضة مشابهة مع نكهة حمضية" 
      },
      { 
        name: "خل التفاح", 
        ratio: "1:1", 
        notes: "نكهة أقوى قليلاً" 
      },
      { 
        name: "خل النبيذ الأبيض", 
        ratio: "1:1", 
        notes: "نكهة أكثر دقة" 
      }
    ]
  },
  "ملح": {
    originalIngredient: "ملح طعام",
    substitutes: [
      { 
        name: "ملح البحر", 
        ratio: "1:1" 
      },
      { 
        name: "صلصة الصويا منخفضة الصوديوم", 
        ratio: "استخدم بحذر حسب الذوق", 
        notes: "يضيف نكهة أومامي" 
      },
      { 
        name: "أعشاب طازجة", 
        ratio: "استخدم حسب الذوق", 
        notes: "لإضافة نكهة بدون ملح" 
      }
    ]
  },
  "بصل": {
    originalIngredient: "بصل",
    substitutes: [
      { 
        name: "كراث", 
        ratio: "1:1", 
        notes: "نكهة أخف" 
      },
      { 
        name: "بصل أخضر", 
        ratio: "1:1", 
        notes: "نكهة أكثر تميزاً" 
      },
      { 
        name: "مسحوق البصل", 
        ratio: "1 ملعقة صغيرة لكل 1/2 كوب بصل طازج" 
      }
    ]
  },
  "ثوم": {
    originalIngredient: "ثوم",
    substitutes: [
      { 
        name: "مسحوق الثوم", 
        ratio: "1/8 ملعقة صغيرة لكل فص ثوم" 
      },
      { 
        name: "الثوم المعمر", 
        ratio: "1 ملعقة كبيرة لكل فص ثوم", 
        notes: "نكهة أخف" 
      },
      { 
        name: "الكراث", 
        ratio: "1/2 كوب كراث لكل فص ثوم", 
        notes: "نكهة مختلفة لكن مقبولة" 
      }
    ]
  },
  "طماطم": {
    originalIngredient: "طماطم طازجة",
    substitutes: [
      { 
        name: "معجون طماطم + ماء", 
        ratio: "2-3 ملاعق كبيرة معجون + 1/4 كوب ماء = كوب طماطم" 
      },
      { 
        name: "طماطم معلبة", 
        ratio: "1:1" 
      },
      { 
        name: "صلصة طماطم", 
        ratio: "1/2 كوب صلصة لكل كوب طماطم", 
        notes: "قد تحتاج لتعديل التوابل" 
      }
    ]
  },
  "ليمون": {
    originalIngredient: "عصير ليمون",
    substitutes: [
      { 
        name: "خل أبيض", 
        ratio: "1/2 الكمية من الخل لكل كمية من الليمون" 
      },
      { 
        name: "عصير ليمون معبأ", 
        ratio: "1:1", 
        notes: "لكن النكهة قد تكون أقل حدة" 
      },
      { 
        name: "خل التفاح", 
        ratio: "1/2 الكمية من الخل لكل كمية من الليمون" 
      }
    ]
  }
};

// English substitution data
const englishSubstitutions: Record<string, SubstitutionResponse> = {
  "flour": {
    originalIngredient: "White Flour",
    substitutes: [
      { 
        name: "Whole Wheat Flour", 
        ratio: "1:1", 
        notes: "Will make food denser and give a stronger flavor"
      },
      { 
        name: "Almond Flour", 
        ratio: "1:1", 
        notes: "Low-carb option, suitable for gluten-free foods"
      },
      { 
        name: "Cornstarch", 
        ratio: "3/4 cup cornstarch for every cup of flour", 
        notes: "Good for baking and thickening" 
      }
    ]
  },
  "sugar": {
    originalIngredient: "White Sugar",
    substitutes: [
      { 
        name: "Honey", 
        ratio: "3/4 cup honey for every cup of sugar", 
        notes: "Reduce other liquids by 1/4 cup for each cup of honey" 
      },
      { 
        name: "Coconut Sugar", 
        ratio: "1:1" 
      },
      { 
        name: "Maple Syrup", 
        ratio: "3/4 cup syrup for every cup of sugar", 
        notes: "Reduce other liquids slightly" 
      }
    ]
  },
  "butter": {
    originalIngredient: "Butter",
    substitutes: [
      { 
        name: "Coconut Oil", 
        ratio: "1:1", 
        notes: "Good for baking, works best at room temperature" 
      },
      { 
        name: "Olive Oil", 
        ratio: "3/4 cup oil for every cup of butter", 
        notes: "Better for savory recipes" 
      },
      { 
        name: "Applesauce", 
        ratio: "1/2 cup applesauce for every cup of butter", 
        notes: "To reduce fat in baked goods" 
      }
    ]
  },
  "eggs": {
    originalIngredient: "Eggs",
    substitutes: [
      { 
        name: "Ground Flaxseed + Water", 
        ratio: "1 tbsp ground flaxseed + 3 tbsp water = 1 egg", 
        notes: "Let sit for 5 minutes until thickened" 
      },
      { 
        name: "Mashed Banana", 
        ratio: "1/4 cup mashed banana = 1 egg", 
        notes: "Suitable for sweet baked goods" 
      },
      { 
        name: "Yogurt", 
        ratio: "1/4 cup yogurt = 1 egg" 
      }
    ]
  },
  "milk": {
    originalIngredient: "Milk",
    substitutes: [
      { 
        name: "Almond Milk", 
        ratio: "1:1" 
      },
      { 
        name: "Coconut Milk", 
        ratio: "1:1", 
        notes: "Adds coconut flavor" 
      },
      { 
        name: "Soy Milk", 
        ratio: "1:1", 
        notes: "Common plant-based alternative" 
      }
    ]
  },
  "olive oil": {
    originalIngredient: "Olive Oil",
    substitutes: [
      { 
        name: "Canola Oil", 
        ratio: "1:1", 
        notes: "Lighter flavor" 
      },
      { 
        name: "Avocado Oil", 
        ratio: "1:1", 
        notes: "Healthy option with high smoke point" 
      },
      { 
        name: "Coconut Oil", 
        ratio: "1:1", 
        notes: "Adds coconut flavor" 
      }
    ]
  },
  "vinegar": {
    originalIngredient: "White Vinegar",
    substitutes: [
      { 
        name: "Lemon Juice", 
        ratio: "1:1", 
        notes: "Gives similar acidity with citrus flavor" 
      },
      { 
        name: "Apple Cider Vinegar", 
        ratio: "1:1", 
        notes: "Slightly stronger flavor" 
      },
      { 
        name: "White Wine Vinegar", 
        ratio: "1:1", 
        notes: "More refined flavor" 
      }
    ]
  },
  "salt": {
    originalIngredient: "Table Salt",
    substitutes: [
      { 
        name: "Sea Salt", 
        ratio: "1:1" 
      },
      { 
        name: "Low-sodium Soy Sauce", 
        ratio: "Use sparingly to taste", 
        notes: "Adds umami flavor" 
      },
      { 
        name: "Fresh Herbs", 
        ratio: "Use to taste", 
        notes: "To add flavor without salt" 
      }
    ]
  },
  "onion": {
    originalIngredient: "Onion",
    substitutes: [
      { 
        name: "Leeks", 
        ratio: "1:1", 
        notes: "Milder flavor" 
      },
      { 
        name: "Green Onions", 
        ratio: "1:1", 
        notes: "More distinctive flavor" 
      },
      { 
        name: "Onion Powder", 
        ratio: "1 tsp for every 1/2 cup fresh onion" 
      }
    ]
  },
  "garlic": {
    originalIngredient: "Garlic",
    substitutes: [
      { 
        name: "Garlic Powder", 
        ratio: "1/8 tsp for each clove of garlic" 
      },
      { 
        name: "Chives", 
        ratio: "1 tbsp for each clove of garlic", 
        notes: "Milder flavor" 
      },
      { 
        name: "Leeks", 
        ratio: "1/2 cup leeks for each clove of garlic", 
        notes: "Different but acceptable flavor" 
      }
    ]
  },
  "tomato": {
    originalIngredient: "Fresh Tomatoes",
    substitutes: [
      { 
        name: "Tomato Paste + Water", 
        ratio: "2-3 tbsp paste + 1/4 cup water = 1 cup tomatoes" 
      },
      { 
        name: "Canned Tomatoes", 
        ratio: "1:1" 
      },
      { 
        name: "Tomato Sauce", 
        ratio: "1/2 cup sauce for every cup of tomatoes", 
        notes: "May need to adjust seasonings" 
      }
    ]
  },
  "lemon": {
    originalIngredient: "Lemon Juice",
    substitutes: [
      { 
        name: "White Vinegar", 
        ratio: "1/2 the amount of vinegar for the amount of lemon" 
      },
      { 
        name: "Bottled Lemon Juice", 
        ratio: "1:1", 
        notes: "But the flavor may be less bright" 
      },
      { 
        name: "Apple Cider Vinegar", 
        ratio: "1/2 the amount of vinegar for the amount of lemon" 
      }
    ]
  }
};

/**
 * Get substitution suggestions for a given ingredient
 * @param ingredient The ingredient to find substitutes for
 * @param language The language to return results in ('ar-EG' or 'en-US')
 */
export async function getIngredientSubstitutes(ingredient: string, language = 'ar-EG'): Promise<SubstitutionResponse> {
  const normalizedIngredient = ingredient.trim().toLowerCase();
  const substitutionsMap = language === 'en-US' ? englishSubstitutions : arabicSubstitutions;
  
  // Check if we have a substitution for this ingredient in the requested language
  for (const [key, value] of Object.entries(substitutionsMap)) {
    if (key.toLowerCase().includes(normalizedIngredient) || 
        normalizedIngredient.includes(key.toLowerCase())) {
      return value;
    }
  }
  
  // If no match was found, return a generic message in the appropriate language
  return {
    originalIngredient: ingredient,
    substitutes: [
      { 
        name: language === 'en-US' 
          ? "We couldn't find specific substitutes for this ingredient" 
          : "لم نتمكن من إيجاد بدائل محددة لهذا المكون", 
        ratio: language === 'en-US' ? "Not available" : "غير متوفر" 
      }
    ]
  };
}