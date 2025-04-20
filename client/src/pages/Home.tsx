import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Ingredients from "@/components/Ingredients";
import RecipeResults from "@/components/RecipeResults";
import SuggestedIngredients from "@/components/SuggestedIngredients";
import CookingTimer from "@/components/CookingTimer";
import IngredientSubstitution from "@/components/IngredientSubstitution";
import LanguageSelector, { Language } from "@/components/LanguageSelector";
import { useCallback, useEffect, useState } from "react";
import { Ingredient, Recipe } from "@/lib/types";
import { fetchRecipes, searchRecipesByName as apiSearchRecipesByName } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import translations from "@/lib/translations";

export default function Home() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [suggestedIngredients, setSuggestedIngredients] = useState<string[]>([]);
  const [recipesCache, setRecipesCache] = useState<Record<string, any>>({});
  const [ingredientInput, setIngredientInput] = useState<string>("");
  const [recipeNameInput, setRecipeNameInput] = useState<string>("");
  const { toast } = useToast();

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

  // Search recipes by name
  const searchRecipesByName = useCallback(async () => {
    if (!recipeNameInput.trim()) {
      toast({
        title: "لا يوجد اسم وصفة",
        description: "الرجاء إدخال اسم الوصفة للبحث",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Use the API function instead of direct fetch
      const data = await apiSearchRecipesByName(recipeNameInput);
      setRecipes(data.recipes || []);
      setSuggestedIngredients(data.suggestedIngredients || []);
    } catch (error) {
      console.error('Error searching recipes by name:', error);
      toast({
        title: "حدث خطأ",
        description: "فشل في البحث عن الوصفات. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [recipeNameInput, toast]);

  // Effect to clear recipes if ingredients are emptied
  useEffect(() => {
    if (ingredients.length === 0) {
      setRecipes([]);
      setSuggestedIngredients([]);
    }
  }, [ingredients]);

  const { language, setLanguage, getLocalizedText } = useLanguage();

  return (
    <div 
      dir={language.startsWith('ar') ? 'rtl' : 'ltr'} 
      lang={language} 
      className="min-h-screen bg-gray-50 text-gray-800 flex flex-col"
    >
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl flex items-center gap-3">
            <span className="text-2xl">🍔</span>
            <span className="font-extrabold text-gray-800 tracking-wide" style={{ fontFamily: 'Comic Sans MS, cursive, sans-serif', textShadow: '1px 1px 2px rgba(255,255,255,0.2)' }}>
              {getLocalizedText('appName', translations.appName)}
            </span>
            <span className="text-2xl">🍕</span>
          </h1>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-sm md:text-base">
              {getLocalizedText('tagline', translations.tagline)}
            </span>
            <div className="flex items-center gap-2">
              <LanguageSelector
                currentLanguage={language}
                onLanguageChange={setLanguage}
              />
              <Button 
                onClick={searchRecipes}
                className="bg-white text-primary hover:bg-gray-100 rounded-full animate-pulse" 
                disabled={ingredients.length === 0}
                size="sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                {getLocalizedText('searchButton', translations.searchButton)}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Search Bar */}
      <div className="bg-white shadow-md py-3 sticky top-0 z-20 border-b border-gray-200">
        <div className="container mx-auto px-4 flex flex-col gap-2">
          {/* Recipe name search */}
          <div className="flex items-center gap-2">
            <div className="flex-grow">
              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                <input
                  type="text"
                  value={recipeNameInput}
                  onChange={(e) => setRecipeNameInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      searchRecipesByName();
                    }
                  }}
                  placeholder={getLocalizedText('recipeNamePlaceholder', translations.recipeNamePlaceholder)}
                  className="flex-grow py-2 px-3 bg-white text-right focus:outline-none"
                />
                <Button
                  onClick={searchRecipesByName}
                  disabled={!recipeNameInput.trim() || isLoading}
                  className="px-3 py-2 bg-primary text-white hover:bg-primary-dark transition-all duration-300"
                >
                  <span>🔍</span> بحث
                </Button>
              </div>
              <div className="text-center my-1">
                <span className="text-gray-500 font-medium">أو</span>
              </div>
            </div>
          </div>
          
          {/* Ingredient search */}
          <div className="flex items-center gap-2">
            <div className="flex-grow">
              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
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
                  placeholder="اكتب المكون اللي عندك في البيت..."
                  className="flex-grow py-2 px-3 bg-white text-right focus:outline-none"
                />
                <Button
                  onClick={() => {
                    if (ingredientInput.trim()) {
                      addIngredient(ingredientInput);
                      setIngredientInput("");
                    }
                  }}
                  className="px-3 py-2 bg-primary text-white hover:bg-primary-dark transition-all duration-300"
                >
                  <span className="animate-pulse">✨</span> حطّه
                </Button>
              </div>
            </div>
            <Button
              onClick={searchRecipes}
              className="bg-secondary text-white py-2 px-5 rounded-lg flex items-center gap-1 hover:bg-secondary-dark hover:scale-105 transition-all duration-300"
              disabled={ingredients.length === 0 || isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 ml-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <span className="animate-pulse">🔍</span>
                </>
              )}
              طلّعلي أكلات
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 flex-grow">
        <Card className="mb-10 shadow-md">
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
        <div className="fixed bottom-20 left-4 md:hidden z-10">
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
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl flex items-center gap-2">
                <span className="text-2xl">🧑‍🍳</span> 
                <span className="font-extrabold text-white tracking-wide" style={{ fontFamily: 'Comic Sans MS, cursive, sans-serif', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>Fast Recipe</span>
              </h2>
              <p className="text-gray-400 text-sm mt-1">ابتكر أكلات جديدة من المكونات اللي موجودة في بيتك</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-400">
                متنساش تديلنا تقييم لو الموقع عجبك 
                <span className="inline-block animate-bounce ml-2">⭐️</span>
                <span className="inline-block animate-bounce ml-1">⭐️</span>
                <span className="inline-block animate-bounce ml-1">⭐️</span>
                <span className="inline-block animate-bounce ml-1">⭐️</span>
                <span className="inline-block animate-bounce ml-1">⭐️</span>
              </p>
              <p className="text-sm text-gray-400 mt-1">عملناه عشانك © {new Date().getFullYear()}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
