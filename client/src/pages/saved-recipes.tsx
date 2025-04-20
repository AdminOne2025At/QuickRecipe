import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SavedRecipe {
  id: number;
  userId: number;
  recipeData: {
    title: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    videoId?: string;
  };
  tags: string[];
  createdAt: string;
}

export default function SavedRecipesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const {
    data: savedRecipes,
    isLoading,
    error,
    refetch,
  } = useQuery<SavedRecipe[]>({
    queryKey: ["/api/users", user?.id, "saved-recipes"],
    queryFn: async () => {
      if (!user) throw new Error("يجب تسجيل الدخول لعرض الوصفات المحفوظة");
      const response = await apiRequest("GET", `/api/users/${user.id}/saved-recipes`);
      if (!response.ok) {
        throw new Error("فشل في الحصول على الوصفات المحفوظة");
      }
      return response.json();
    },
    enabled: !!user,
  });

  const handleDeleteRecipe = async (recipeId: number) => {
    if (!user) return;

    try {
      setDeletingId(recipeId);
      const response = await apiRequest("DELETE", `/api/users/${user.id}/saved-recipes/${recipeId}`);

      if (response.ok) {
        toast({
          title: "تم الحذف بنجاح",
          description: "تم حذف الوصفة من الوصفات المحفوظة",
        });
        refetch();
      } else {
        throw new Error("فشل في حذف الوصفة");
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
      toast({
        title: "حدث خطأ",
        description: "فشل في حذف الوصفة، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-10 text-center">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">تسجيل الدخول مطلوب</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">يجب عليك تسجيل الدخول لعرض الوصفات المحفوظة الخاصة بك</p>
            <Button asChild>
              <Link href="/auth">تسجيل الدخول</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 text-center">
        <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
        <p>جاري تحميل الوصفات المحفوظة...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 text-center">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <p className="text-red-600 mb-4">حدث خطأ أثناء تحميل الوصفات المحفوظة</p>
            <Button onClick={() => refetch()}>إعادة المحاولة</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!savedRecipes || savedRecipes.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl text-center">لا توجد وصفات محفوظة</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6">لم تقم بحفظ أي وصفات بعد</p>
            <Button asChild>
              <Link href="/">البحث عن وصفات</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">الوصفات المحفوظة</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedRecipes.map((recipe) => (
          <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl line-clamp-1">{recipe.recipeData.title}</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {recipe.recipeData.description}
              </p>
              <div className="text-sm">
                <h4 className="font-semibold mb-1">المكونات:</h4>
                <ul className="list-disc list-inside mb-4">
                  {recipe.recipeData.ingredients.slice(0, 3).map((ingredient, i) => (
                    <li key={i} className="line-clamp-1">{ingredient}</li>
                  ))}
                  {recipe.recipeData.ingredients.length > 3 && (
                    <li className="text-muted-foreground">
                      +{recipe.recipeData.ingredients.length - 3} مكونات أخرى
                    </li>
                  )}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <Button variant="secondary" asChild className="w-2/3">
                <Link href={`/recipe/${recipe.id}`}>عرض التفاصيل</Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    disabled={deletingId === recipe.id}
                  >
                    {deletingId === recipe.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                    <AlertDialogDescription>
                      سيتم حذف الوصفة "{recipe.recipeData.title}" من قائمة الوصفات المحفوظة.
                      هذا الإجراء لا يمكن التراجع عنه.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteRecipe(recipe.id)}
                      className="bg-red-500 hover:bg-red-700"
                    >
                      نعم، قم بالحذف
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}