import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Heart, PlayCircle } from "lucide-react";
import { Recipe } from "@/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";
import ShareModal from "../components/ShareModal";

interface RecipeCardProps {
  recipe: {
    id?: number;
    title: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    videoId?: string;
    image?: string;
  };
  onSave?: (recipe: Recipe) => void;
  isSaved?: boolean;
}

export function RecipeCard({ recipe, onSave, isSaved = false }: RecipeCardProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { getLocalizedText, language } = useLanguage();
  
  // النصوص المترجمة
  const texts = {
    share: {
      'ar-EG': 'مشاركة',
      'ar-SA': 'مشاركة',
      'en-US': 'Share'
    },
    save: {
      'ar-EG': 'حفظ',
      'ar-SA': 'حفظ',
      'en-US': 'Save'
    },
    saved: {
      'ar-EG': 'تم الحفظ',
      'ar-SA': 'تم الحفظ',
      'en-US': 'Saved'
    },
    watchVideo: {
      'ar-EG': 'مشاهدة الفيديو',
      'ar-SA': 'مشاهدة الفيديو',
      'en-US': 'Watch Video'
    },
    ingredients: {
      'ar-EG': 'المكونات',
      'ar-SA': 'المكونات',
      'en-US': 'Ingredients'
    }
  };
  
  return (
    <>
      <Card className="overflow-hidden border border-gray-200 transition-all hover:shadow-md">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg font-bold text-orange-600 line-clamp-2">
            {recipe.title}
          </CardTitle>
          <CardDescription className="line-clamp-2 min-h-[40px]">
            {recipe.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-4 pt-2">
          <div className="mb-3">
            <h4 className="mb-1 font-medium text-sm text-gray-700">
              {getLocalizedText('ingredients', texts.ingredients)}
            </h4>
            <div className="flex flex-wrap gap-1">
              {recipe.ingredients.slice(0, 5).map((ingredient, idx) => (
                <Badge key={idx} variant="outline" className="bg-orange-50">
                  {ingredient}
                </Badge>
              ))}
              {recipe.ingredients.length > 5 && (
                <Badge variant="outline" className="bg-orange-50">
                  +{recipe.ingredients.length - 5}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between p-4 pt-0">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => setIsShareModalOpen(true)}
            >
              <Share2 className="h-4 w-4" />
              <span className="text-xs">{getLocalizedText('share', texts.share)}</span>
            </Button>
            
            {recipe.videoId && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => window.open(`https://www.youtube.com/watch?v=${recipe.videoId}`, '_blank')}
              >
                <PlayCircle className="h-4 w-4 text-red-500" />
                <span className="text-xs">{getLocalizedText('watchVideo', texts.watchVideo)}</span>
              </Button>
            )}
          </div>
          
          {onSave && (
            <Button
              variant={isSaved ? "secondary" : "outline"}
              size="sm"
              className="gap-1"
              onClick={() => onSave(recipe as Recipe)}
            >
              <Heart className={`h-4 w-4 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
              <span className="text-xs">
                {isSaved 
                  ? getLocalizedText('saved', texts.saved)
                  : getLocalizedText('save', texts.save)}
              </span>
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <ShareModal 
        open={isShareModalOpen} 
        onOpenChange={setIsShareModalOpen} 
        recipe={recipe} 
      />
    </>
  );
}

export default RecipeCard;