import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Ingredients from "@/components/Ingredients";
import RecipeResults from "@/components/RecipeResults";
import SuggestedIngredients from "@/components/SuggestedIngredients";
import CookingTimer from "@/components/CookingTimer";
import { useCallback, useEffect, useState } from "react";
import { Ingredient, Recipe } from "@/lib/types";
import { fetchRecipes } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [suggestedIngredients, setSuggestedIngredients] = useState<string[]>([]);
  const [recipesCache, setRecipesCache] = useState<Record<string, any>>({});
  const [ingredientInput, setIngredientInput] = useState<string>("");
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

  // Effect to clear recipes if ingredients are emptied
  useEffect(() => {
    if (ingredients.length === 0) {
      setRecipes([]);
      setSuggestedIngredients([]);
    }
  }, [ingredients]);

  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm.293 4.793a1 1 0 011.414 0L10 10.086l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414zM6 9a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            طباخ الوصفات
          </h1>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-sm md:text-base">ابحث عن وصفات من المكونات المتوفرة لديك</span>
            <Button 
              onClick={searchRecipes}
              className="bg-white text-primary hover:bg-gray-100 rounded-full" 
              disabled={ingredients.length === 0}
              size="sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              بحث
            </Button>
          </div>
        </div>
      </header>

      {/* Quick Search Bar */}
      <div className="bg-white shadow-md py-3 sticky top-0 z-20 border-b border-gray-200">
        <div className="container mx-auto px-4 flex items-center gap-2">
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
                placeholder="أدخل المكون للإضافة السريعة..."
                className="flex-grow py-2 px-3 bg-white text-right focus:outline-none"
              />
              <Button
                onClick={() => {
                  if (ingredientInput.trim()) {
                    addIngredient(ingredientInput);
                    setIngredientInput("");
                  }
                }}
                className="px-3 py-2 bg-primary text-white"
              >
                إضافة
              </Button>
            </div>
          </div>
          <Button
            onClick={searchRecipes}
            className="bg-secondary text-white py-2 px-5 rounded-lg flex items-center gap-1"
            disabled={ingredients.length === 0 || isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 ml-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            )}
            بحث عن وصفات
          </Button>
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

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold">طباخ الوصفات</h2>
              <p className="text-gray-400 text-sm mt-1">اكتشف وصفات جديدة من المكونات المتوفرة لديك</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-400">تم التطوير بواسطة فريق طباخ الوصفات © {new Date().getFullYear()}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
