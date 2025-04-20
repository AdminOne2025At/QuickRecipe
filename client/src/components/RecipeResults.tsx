import { Card, CardContent } from "@/components/ui/card";
import { Ingredient, Recipe } from "@/lib/types";
import { Loader2 } from "lucide-react";

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
  if (isLoading) {
    return (
      <div className="mb-8 text-center">
        <Card className="inline-block p-8">
          <CardContent className="flex flex-col items-center animate-pulse p-0">
            <Loader2 className="h-12 w-12 text-primary mb-4 animate-spin" />
            <p className="text-lg font-medium">جاري البحث عن وصفات...</p>
            <p className="text-sm text-gray-500">يرجى الانتظار بينما نبحث عن أفضل الوصفات لك</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (recipes.length === 0 && ingredients.length > 0) {
    return null;
  }

  return (
    <div id="recipes" className="mt-8 space-y-8">
      {recipes.map((recipe, index) => (
        <Card key={index} className="recipe-card bg-white rounded-lg shadow-md overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-3 text-gray-800">{recipe.title}</h3>
              <div className="mb-4 text-gray-600">
                <p className="mb-2">{recipe.description}</p>
              </div>
              <div className="mb-4">
                <h4 className="font-bold mb-2 text-gray-700">المكونات:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {recipe.ingredients.map((ingredient, i) => (
                    <li key={i}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-2 text-gray-700">طريقة التحضير:</h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-600">
                  {recipe.instructions.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
            
            {recipe.videoId && (
              <div className="px-6 pb-6">
                <h4 className="font-bold mb-3 text-gray-700">شاهد طريقة التحضير:</h4>
                <div className="rounded-lg overflow-hidden relative" style={{ paddingBottom: '56.25%', height: 0 }}>
                  <iframe 
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${recipe.videoId}`}
                    title={recipe.title}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
