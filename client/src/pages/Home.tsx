import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Ingredients from "@/components/Ingredients";
import RecipeResults from "@/components/RecipeResults";
import SuggestedIngredients from "@/components/SuggestedIngredients";
import CookingTimer from "@/components/CookingTimer";
import IngredientSubstitution from "@/components/IngredientSubstitution";
import ContactModal from "@/components/ContactModal";
import { useCallback, useEffect, useState } from "react";
import { Ingredient, Recipe } from "@/lib/types";
import { fetchRecipes } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [suggestedIngredients, setSuggestedIngredients] = useState<string[]>([]);
  const [recipesCache, setRecipesCache] = useState<Record<string, any>>({});
  const [ingredientInput, setIngredientInput] = useState<string>("");
  const { toast } = useToast();
  const { language, isArabic } = useLanguage();
  
  // Set correct language direction for the document
  useEffect(() => {
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.documentElement.lang = isArabic ? 'ar-EG' : 'en-US';
  }, [isArabic]);

  const addIngredient = (name: string) => {
    if (!name.trim()) return;
    
    // Create new ingredient with unique ID
    const newIngredient: Ingredient = { 
      id: Date.now().toString(), 
      name: name.trim() 
    };
    
    setIngredients(prev => [...prev, newIngredient]);
  };

  const removeIngredient = (id: string) => {
    setIngredients(prev => prev.filter(item => item.id !== id));
  };

  const clearIngredients = () => {
    setIngredients([]);
    setRecipes([]);
    setSuggestedIngredients([]);
  };

  const searchRecipes = useCallback(async () => {
    if (ingredients.length === 0) {
      toast({
        title: "لا توجد مكونات",
        description: "الرجاء إضافة المكونات أولاً للبحث عن الوصفات",
        variant: "destructive",
      });
      return;
    }

    // Sort ingredients alphabetically for consistent cache keys
    const sortedIngredients = [...ingredients].sort((a, b) => a.name.localeCompare(b.name));
    const cacheKey = sortedIngredients.map(i => i.name).join(',');

    // Check cache first
    if (recipesCache[cacheKey]) {
      setRecipes(recipesCache[cacheKey].recipes);
      setSuggestedIngredients(recipesCache[cacheKey].suggestedIngredients);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetchRecipes(ingredients.map(i => i.name));
      
      setRecipes(response.recipes);
      setSuggestedIngredients(response.suggestedIngredients);
      
      // Cache the results
      setRecipesCache(prev => ({
        ...prev,
        [cacheKey]: response
      }));
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast({
        title: "حدث خطأ",
        description: "فشل في البحث عن الوصفات. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [ingredients, recipesCache, toast]);

  const handleSuggestedIngredientClick = (ingredient: string) => {
    addIngredient(ingredient);
  };

  // Effect to clear recipes if ingredients are emptied
  useEffect(() => {
    if (ingredients.length === 0) {
      setRecipes([]);
      setSuggestedIngredients([]);
    }
  }, [ingredients]);

  return (
    <div 
      dir={isArabic ? "rtl" : "ltr"} 
      lang={isArabic ? "ar-EG" : "en-US"} 
      className="min-h-screen bg-animated text-gray-800 flex flex-col"
    >
      {/* أيقونات الطعام المتحركة في الخلفية */}
      <div className="food-icon text-6xl spin-slow" style={{ top: '8%', left: '5%' }}>🥕</div>
      <div className="food-icon text-6xl" style={{ top: '25%', right: '7%', animationDelay: '0.5s' }}>🍅</div>
      <div className="food-icon text-6xl spin-slow" style={{ bottom: '30%', left: '9%', animationDelay: '1s' }}>🍊</div>
      <div className="food-icon text-6xl" style={{ bottom: '15%', right: '8%', animationDelay: '1.5s' }}>🍗</div>
      <div className="food-icon text-6xl spin-slow" style={{ top: '40%', left: '15%', animationDelay: '2s' }}>🧀</div>
      <div className="food-icon text-6xl" style={{ top: '60%', right: '12%', animationDelay: '2.5s' }}>🥑</div>
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center max-w-5xl">
          <h1 className="text-3xl md:text-4xl flex items-center gap-3">
            <img src="/quick-recipe-new-logo.png" alt="Quick Recipe Logo" className="h-10 md:h-12" />
            <span className="font-extrabold text-white tracking-wide" style={{ fontFamily: 'Comic Sans MS, cursive, sans-serif', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
           Recipes
            </span>
          </h1>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-sm md:text-base">
              {isArabic 
                ? "دوّر على أكلات من المكونات اللي عندك في البيت" 
                : "Find recipes using ingredients at home"}
            </span>
            <div className="flex items-center gap-2">
              {/* Search button removed */}
            </div>
          </div>
        </div>
      </header>

      {/* Quick Search Bar */}
      <div className="bg-white shadow-md py-3 sticky top-0 z-20 border-b border-gray-200">
        <div className="container mx-auto px-4 flex flex-col gap-2 max-w-3xl">
          {/* Ingredient search */}
          <div className="flex flex-col md:flex-row items-center gap-2">
            <div className="flex-grow w-full">
              <div className="flex rounded-lg border border-gray-300 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <input
                  type="text"
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)} 
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      if (ingredientInput.trim()) {
                        addIngredient(ingredientInput);
                        setIngredientInput("");
                      }
                    }
                  }}
                  placeholder={isArabic ? "ابحث عن مكونات اكلة من اسمها..." : "Search for recipe ingredients by name..."}
                  className={`flex-grow py-2 px-3 bg-white ${isArabic ? 'text-right' : 'text-left'} focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50`}
                />
                <Button
                  onClick={searchRecipes}
                  className="px-3 py-2 bg-primary text-white hover:bg-primary-dark transition-all duration-300"
                  disabled={ingredients.length === 0 || isLoading}
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      <span>🔍</span> {isArabic ? "دوّر" : "Search"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 flex-grow max-w-5xl">
        <Card className="mb-10 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <Ingredients 
              ingredients={ingredients}
              onAddIngredient={addIngredient}
              onRemoveIngredient={removeIngredient}
              onClearIngredients={clearIngredients}
              onSearchRecipes={searchRecipes}
            />
          </CardContent>
        </Card>

        <RecipeResults 
          recipes={recipes} 
          isLoading={isLoading} 
          ingredients={ingredients}
        />

        {suggestedIngredients.length > 0 && (
          <SuggestedIngredients 
            suggestedIngredients={suggestedIngredients}
            onClick={handleSuggestedIngredientClick}
          />
        )}
        
        {/* Ingredient Substitution Component */}
        <div className="mt-10">
          <IngredientSubstitution />
        </div>
      </main>

      {/* Fixed Search Button for Mobile */}
      {ingredients.length > 0 && (
        <div className={`fixed bottom-20 ${isArabic ? 'left-4' : 'right-4'} md:hidden z-10`}>
          <Button
            onClick={searchRecipes}
            className="rounded-full w-14 h-14 shadow-lg bg-primary hover:bg-primary-dark text-white flex items-center justify-center"
            disabled={isLoading}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </Button>
        </div>
      )}
      
      {/* Cooking Timer Component */}
      <CookingTimer />

      <footer className="bg-gray-800 text-white py-8 border-t-4 border-secondary">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl flex items-center gap-2">
                <img src="/quick-recipe-new-logo.png" alt="Quick Recipe Logo" className="h-7 md:h-8" />
                <span className="font-extrabold text-white tracking-wide" style={{ fontFamily: 'Comic Sans MS, cursive, sans-serif', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
                  Quick Recipe
                </span>
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                {isArabic 
                  ? "ابتكر أكلات جديدة من المكونات اللي موجودة في بيتك" 
                  : "Create new dishes from ingredients you have at home"}
              </p>
            </div>
            <div className={`text-center md:${isArabic ? 'text-right' : 'text-left'}`}>
              <p className="text-sm text-gray-400">
                {isArabic 
                  ? "متنساش تديلنا تقييم لو الموقع عجبك" 
                  : "Don't forget to rate us if you like the site"}
                <span className={`inline-block animate-bounce ${isArabic ? 'mr-1' : 'ml-1'}`}>⭐️</span>
                <span className="inline-block animate-bounce ml-1">⭐️</span>
                <span className="inline-block animate-bounce ml-1">⭐️</span>
                <span className="inline-block animate-bounce ml-1">⭐️</span>
                <span className="inline-block animate-bounce ml-1">⭐️</span>
              </p>
              <p className="text-sm text-gray-400 mt-1">
                © 2025 Egyptco - {isArabic ? "عملناه عشانك" : "Made for you"}
              </p>
              <div className="mt-2">
                <ContactModal />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}