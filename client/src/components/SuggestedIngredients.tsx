import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SuggestedIngredientsProps {
  suggestedIngredients: string[];
  onClick: (ingredient: string) => void;
}

export default function SuggestedIngredients({
  suggestedIngredients,
  onClick,
}: SuggestedIngredientsProps) {
  if (!suggestedIngredients.length) return null;

  return (
    <Card className="mb-10 shadow-md">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">مكونات مقترحة إضافية</h2>
        <p className="text-gray-600 mb-4">يمكنك إضافة هذه المكونات للحصول على المزيد من الوصفات:</p>
        
        <div className="flex flex-wrap gap-2">
          {suggestedIngredients.map((ingredient, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => onClick(ingredient)}
              className="bg-gray-100 hover:bg-primary-100 px-3 py-1 rounded-full text-gray-800 text-sm transition-colors"
            >
              {ingredient} +
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
