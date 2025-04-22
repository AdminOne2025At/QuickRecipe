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
import { fetchRecipes, searchRecipesByName as apiSearchRecipesByName } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [suggestedIngredients, setSuggestedIngredients] = useState<string[]>([]);
  const [recipesCache, setRecipesCache] = useState<Record<string, any>>({});
  const [ingredientInput, setIngredientInput] = useState<string>("");
  const [recipeNameInput, setRecipeNameInput] = useState<string>("");
  const { toast } = useToast();
  
  // Set RTL direction for the document
  useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar-EG';
  }, []);

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

  return (
    <div 
      dir="rtl" 
      lang="ar-EG" 
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
              دوّر على أكلات من المكونات اللي عندك في البيت
            </span>
            <div className="flex items-center gap-2">
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
                دوّر
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Search Bar */}
      <div className="bg-white shadow-md py-3 sticky top-0 z-20 border-b border-gray-200">
        <div className="container mx-auto px-4 flex flex-col gap-2 max-w-3xl">
          {/* Recipe name search */}
          <div className="flex items-center gap-2">
            <div className="flex-grow">
              <div className="flex rounded-lg border border-gray-300 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <input
                  type="text"
                  value={recipeNameInput}
                  onChange={(e) => setRecipeNameInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      searchRecipesByName();
                    }
                  }}
                  placeholder="ابحث عن وصفة بالاسم..."
                  className="flex-grow py-2 px-3 bg-white text-right focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                />
                <Button
                  onClick={searchRecipesByName}
                  disabled={!recipeNameInput.trim() || isLoading}
                  className="px-3 py-2 bg-primary text-white hover:bg-primary-dark transition-all duration-300"
                >
                  <span>🔍</span> بحث
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
                ابتكر أكلات جديدة من المكونات اللي موجودة في بيتك
              </p>
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
              <p className="text-sm text-gray-400 mt-1">© 2025 Egyptco - عملناه عشانك</p>
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