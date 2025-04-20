import { Card, CardContent } from "@/components/ui/card";
import { Ingredient, Recipe } from "@/lib/types";
import { Loader2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import RecipeCard from "./RecipeCard";
import { useLanguage } from "@/contexts/LanguageContext";

interface RecipeResultsProps {
  recipes: Recipe[];
  isLoading: boolean;
  ingredients: Ingredient[];
}

export default function RecipeResults({
  recipes,
  isLoading,
  ingredients,
}: RecipeResultsProps) {
  const [expandedRecipeIndex, setExpandedRecipeIndex] = useState<number | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<number[]>([]);
  const { getLocalizedText, language } = useLanguage();
  // بشكل مؤقت، نضع معرف مستخدم بدلًا من استخدام معلومات المستخدم الحقيقية
  const currentUser = null; // في المرحلة الأولى لن نستخدم ميزات المستخدم
  
  // النصوص المترجمة
  const texts = {
    loading: {
      'ar-EG': 'استنى شوية بندور في المطبخ...',
      'ar-SA': 'انتظر قليلاً بينما نبحث في المطبخ...',
      'en-US': 'Wait while we search in the kitchen...'
    },
    loadingDescription: {
      'ar-EG': 'بنطبخلك أحلى وصفات من مكوناتك، شوية وهيجهزوا 😋',
      'ar-SA': 'نعد لك أفضل الوصفات من مكوناتك، قليلاً وستكون جاهزة 😋',
      'en-US': 'We\'re cooking the best recipes from your ingredients, they\'ll be ready soon 😋'
    },
    viewRecipe: {
      'ar-EG': 'شوف الوصفة كاملة',
      'ar-SA': 'عرض الوصفة كاملة',
      'en-US': 'View full recipe'
    },
    ingredients: {
      'ar-EG': 'الحاجات اللي هنحتاجها:',
      'ar-SA': 'المكونات التي نحتاجها:',
      'en-US': 'Ingredients we need:'
    },
    instructions: {
      'ar-EG': 'طريقة الشغل:',
      'ar-SA': 'طريقة التحضير:',
      'en-US': 'Cooking instructions:'
    },
    watchVideo: {
      'ar-EG': 'كمان ممكن تتفرج على الفيديو:',
      'ar-SA': 'يمكنك أيضاً مشاهدة الفيديو:',
      'en-US': 'You can also watch the video:'
    }
  };

  // حفظ وصفة
  const handleSaveRecipe = (recipe: Recipe) => {
    if (!currentUser) return;
    
    // في التطبيق الحقيقي، يجب إرسال الحفظ إلى قاعدة البيانات
    // هنا نقوم فقط بمحاكاة الحفظ محلياً
    if (savedRecipes.includes(recipe.id || 0)) {
      setSavedRecipes(savedRecipes.filter(id => id !== recipe.id));
    } else {
      setSavedRecipes([...savedRecipes, recipe.id || 0]);
    }
  };

  if (isLoading) {
    return (
      <div className="mb-8 text-center">
        <Card className="inline-block p-8 border-2 border-dashed border-orange-300">
          <CardContent className="flex flex-col items-center animate-pulse p-0">
            <Loader2 className="h-12 w-12 text-orange-500 mb-4 animate-spin" />
            <p className="text-lg font-medium">{getLocalizedText('loading', texts.loading)}</p>
            <p className="text-sm text-gray-500">{getLocalizedText('loadingDescription', texts.loadingDescription)}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (recipes.length === 0 && ingredients.length > 0) {
    return null;
  }

  return (
    <div id="recipes" className="mt-8">
      {/* عرض بطاقات الوصفات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {recipes.map((recipe, index) => (
          <RecipeCard
            key={index}
            recipe={recipe}
            onSave={currentUser ? () => handleSaveRecipe(recipe) : undefined}
            isSaved={savedRecipes.includes(recipe.id || 0)}
          />
        ))}
      </div>
      
      {/* عرض تفاصيل الوصفة الكاملة عند النقر عليها */}
      {expandedRecipeIndex !== null && (
        <Card 
          className="recipe-card bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-orange-200 mb-8"
        >
          <CardContent className="p-0">
            <div className="relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500"></div>
            </div>
            <div className="p-6">
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-800 flex items-center gap-2">
                <span className="text-2xl">🍽️</span> {recipes[expandedRecipeIndex].title}
              </h3>
              <div className="mb-4 text-gray-600 bg-orange-50 p-3 rounded-md italic">
                <p className="mb-2">{recipes[expandedRecipeIndex].description}</p>
              </div>
              <div className="mb-6 bg-gray-50 p-4 rounded-md border-l-4 border-orange-500 shadow-sm">
                <h4 className="font-bold mb-3 text-gray-700 flex items-center gap-2">
                  <span className="text-lg">🧾</span> {getLocalizedText('ingredients', texts.ingredients)}
                </h4>
                <ul className="space-y-2 text-gray-600">
                  {recipes[expandedRecipeIndex].ingredients.map((ingredient, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="inline-block bg-orange-500 text-white rounded-full w-5 h-5 flex-shrink-0 text-xs flex items-center justify-center mt-1">
                        {i+1}
                      </span>
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gradient-to-r from-orange-100 to-amber-100 p-4 rounded-md">
                <h4 className="font-bold mb-3 text-gray-700 flex items-center gap-2">
                  <span className="text-lg">👩‍🍳</span> {getLocalizedText('instructions', texts.instructions)}
                </h4>
                <ol className="space-y-3 text-gray-600">
                  {recipes[expandedRecipeIndex].instructions.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 bg-white bg-opacity-70 p-2 rounded-md shadow-sm">
                      <span className="inline-block bg-amber-500 text-white rounded-full w-6 h-6 flex-shrink-0 text-sm flex items-center justify-center mt-1 font-bold">
                        {i+1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-4 text-center">
                  <span className="inline-block animate-bounce text-xl">👌</span>
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => setExpandedRecipeIndex(null)}
                >
                  العودة
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => {
                    // ستحتاج إلى تعديل ShareModal لكي يعمل هنا
                    // للتبسيط، سنفتح حوار المشاركة الأصلي للمتصفح
                    if (navigator.share) {
                      navigator.share({
                        title: recipes[expandedRecipeIndex].title,
                        text: recipes[expandedRecipeIndex].description,
                        url: window.location.href
                      });
                    }
                  }}
                >
                  <Share2 className="h-4 w-4" />
                  مشاركة
                </Button>
              </div>
            </div>
            
            {recipes[expandedRecipeIndex].videoId && (
              <div className="px-6 pb-6 mt-4">
                <h4 className="font-bold mb-3 text-gray-700 flex items-center gap-2">
                  <span className="text-red-500">▶️</span> {getLocalizedText('watchVideo', texts.watchVideo)}
                </h4>
                <div className="rounded-lg overflow-hidden relative shadow-md" style={{ paddingBottom: '56.25%', height: 0 }}>
                  <iframe 
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${recipes[expandedRecipeIndex].videoId}`}
                    title={recipes[expandedRecipeIndex].title}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* زر لعرض تفاصيل الوصفة */}
      {recipes.length > 0 && expandedRecipeIndex === null && (
        <div className="text-center mb-8">
          <Button
            variant="outline"
            onClick={() => setExpandedRecipeIndex(0)}
            className="gap-2"
          >
            {getLocalizedText('viewRecipe', texts.viewRecipe)}
          </Button>
        </div>
      )}
    </div>
  );
}
