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
        <Card className="inline-block p-8 border-2 border-dashed border-primary/50">
          <CardContent className="flex flex-col items-center animate-pulse p-0">
            <Loader2 className="h-12 w-12 text-primary mb-4 animate-spin" />
            <p className="text-lg font-medium">استنى شوية بندور في المطبخ...</p>
            <p className="text-sm text-gray-500">بنطبخلك أحلى وصفات من مكوناتك، شوية وهيجهزوا 😋</p>
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
        <Card 
          key={index} 
          className="recipe-card bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-primary/20"
        >
          <CardContent className="p-0">
            <div className="relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
            </div>
            <div className="p-6">
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-800 flex items-center gap-2">
                <span className="text-2xl">🍽️</span> {recipe.title}
              </h3>
              <div className="mb-4 text-gray-600 bg-primary/5 p-3 rounded-md italic">
                <p className="mb-2">{recipe.description}</p>
              </div>
              <div className="mb-6 bg-gray-50 p-4 rounded-md border-l-4 border-primary shadow-sm">
                <h4 className="font-bold mb-3 text-gray-700 flex items-center gap-2">
                  <span className="text-lg">🧾</span> الحاجات اللي هنحتاجها:
                </h4>
                <ul className="space-y-2 text-gray-600">
                  {recipe.ingredients.map((ingredient, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="inline-block bg-primary text-white rounded-full w-5 h-5 flex-shrink-0 text-xs flex items-center justify-center mt-1">
                        {i+1}
                      </span>
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-md">
                <h4 className="font-bold mb-3 text-gray-700 flex items-center gap-2">
                  <span className="text-lg">👩‍🍳</span> طريقة الشغل:
                </h4>
                <ol className="space-y-3 text-gray-600">
                  {recipe.instructions.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 bg-white bg-opacity-70 p-2 rounded-md shadow-sm">
                      <span className="inline-block bg-secondary text-white rounded-full w-6 h-6 flex-shrink-0 text-sm flex items-center justify-center mt-1 font-bold">
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
            </div>
            
            {recipe.videoId && (
              <div className="px-6 pb-6 mt-4">
                <h4 className="font-bold mb-3 text-gray-700 flex items-center gap-2">
                  <span className="text-red-500">▶️</span> كمان ممكن تتفرج على الفيديو:
                </h4>
                <div className="rounded-lg overflow-hidden relative shadow-md" style={{ paddingBottom: '56.25%', height: 0 }}>
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
