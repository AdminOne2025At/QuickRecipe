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
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-800">أدخل المكونات المتوفرة لديك</h2>
      
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <div className="flex-grow">
          <Input
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="أدخل المكون هنا..."
            className="w-full px-4 py-2 text-right"
          />
        </div>
        <Button onClick={handleAddIngredient} className="bg-primary text-white hover:bg-primary/90">
          إضافة
        </Button>
      </div>
      
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">المكونات المختارة:</h3>
        <div className="flex flex-wrap gap-2 min-h-[40px]">
          {ingredients.map((ingredient) => (
            <div
              key={ingredient.id}
              className="bg-gray-100 px-3 py-1 rounded-full text-gray-800 flex items-center text-sm"
            >
              {ingredient.name}
              <button
                onClick={() => onRemoveIngredient(ingredient.id)}
                className="mr-1 text-gray-500 hover:text-red-500"
                aria-label="إزالة المكون"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {ingredients.length === 0 && (
        <Alert variant="warning" className="mb-4 bg-yellow-50 border-yellow-500 text-yellow-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            الرجاء إدخال المكونات أولاً للحصول على اقتراحات للوصفات
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex gap-2 justify-center md:justify-start">
        <Button
          onClick={onSearchRecipes}
          className="px-6 py-2 bg-secondary-500 hover:bg-secondary-600 text-white rounded-lg font-medium"
          disabled={ingredients.length === 0}
        >
          البحث عن وصفات
        </Button>
        <Button
          onClick={onClearIngredients}
          variant="outline"
          className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-lg"
        >
          مسح المكونات
        </Button>
      </div>
    </div>
  );
}
