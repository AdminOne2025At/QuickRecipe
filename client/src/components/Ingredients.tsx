import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ingredient } from "@/lib/types";
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface IngredientsProps {
  ingredients: Ingredient[];
  onAddIngredient: (name: string) => void;
  onRemoveIngredient: (id: string) => void;
  onClearIngredients: () => void;
  onSearchRecipes: () => void;
}

export default function Ingredients({
  ingredients,
  onAddIngredient,
  onRemoveIngredient,
  onClearIngredients,
  onSearchRecipes,
}: IngredientsProps) {
  const [ingredientInput, setIngredientInput] = useState("");

  const handleAddIngredient = () => {
    if (ingredientInput.trim()) {
      onAddIngredient(ingredientInput);
      setIngredientInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddIngredient();
    }
  };

  return (
    <div className="relative">
      <div className="absolute top-2 left-5 transform rotate-12 w-6 h-6 rounded-full bg-gradient-to-tl from-cyan-300 to-blue-500 opacity-20 floating-icon"></div>
      <div className="absolute bottom-5 right-10 transform -rotate-12 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 opacity-20 floating-icon" style={{ animationDelay: '1.5s' }}></div>
      
      <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2 relative z-10">
        <span className="animate-pulse">🛒</span> 
        <span className="gradient-text">أكتب المكونات اللي عندك في البيت</span>
      </h2>
      
      <div className="flex flex-col md:flex-row gap-2 mb-4 relative z-10">
        <div className="flex-grow">
          <Input
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="زي البصل، التوم، الطماطم..."
            className="w-full px-4 py-2 text-right shadow-inner transition-all duration-300 focus:ring-2 focus:ring-primary"
          />
        </div>
        <Button 
          onClick={handleAddIngredient} 
          className="bg-primary text-white hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-md"
        >
          <span className="ml-1">✨</span> حطّه في السلة
        </Button>
      </div>
      
      <div className="mb-6 relative z-10">
        <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
          <span className="animate-bounce text-lg">🥗</span> الحاجات اللي اخترتها:
        </h3>
        <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border border-dashed border-gray-300 rounded-md bg-gradient-to-r from-gray-50 to-white shadow-inner">
          {ingredients.map((ingredient, index) => (
            <div
              key={ingredient.id}
              className="bg-gradient-to-r from-primary-light to-primary-light/60 px-3 py-1 rounded-full text-gray-800 flex items-center text-sm shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {ingredient.name}
              <button
                onClick={() => onRemoveIngredient(ingredient.id)}
                className="mr-1 text-gray-800 hover:text-red-500 font-bold transition-colors"
                aria-label="إزالة المكون"
              >
                ×
              </button>
            </div>
          ))}
          {ingredients.length === 0 && (
            <span className="text-gray-400 text-sm py-1 px-2 animate-pulse">لسه مختارتش حاجات...</span>
          )}
        </div>
      </div>
      
      {ingredients.length === 0 && (
        <Alert className="mb-4 bg-yellow-50 border border-yellow-500 text-yellow-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            محتاجين تدخل المكونات الأول عشان نقدر نطلعلك أكلات حلوة
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex gap-2 justify-center md:justify-start">
        <Button
          onClick={onSearchRecipes}
          className="px-6 py-2 bg-secondary hover:bg-secondary-dark text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
          disabled={ingredients.length === 0}
        >
          <span className="ml-1">🍳</span> اطبخلي حاجة
        </Button>
        <Button
          onClick={onClearIngredients}
          variant="outline"
          className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-lg transition-all duration-300"
        >
          <span className="ml-1">🧹</span> امسح الكل
        </Button>
      </div>
    </div>
  );
}
