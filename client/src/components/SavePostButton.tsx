import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";

export interface SavePostButtonProps {
  postId: number;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  showText?: boolean;
}

export default function SavePostButton({ 
  postId, 
  variant = "ghost", 
  size = "sm",
  showText = true 
}: SavePostButtonProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isSaved, setIsSaved] = useState(false);

  // استخراج معرف المستخدم من localStorage إذا لم يكن متوفراً في context
  const getUserIdFromStorage = (): number | null => {
    if (user) return user.id;
    
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        return parsedUser.id;
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
        return null;
      }
    }
    return null;
  };

  const userId = getUserIdFromStorage();
  
  // التحقق مما إذا كان المنشور محفوظًا بالفعل
  const { data, isLoading, isError } = useQuery({
    queryKey: ["/api/users", userId, "saved-posts"],
    queryFn: async () => {
      if (!userId) return [];
      
      const res = await apiRequest("GET", `/api/users/${userId}/saved-posts`);
      return await res.json();
    },
    enabled: !!userId,
  });

  // تحديث حالة الحفظ عند تحميل البيانات
  useEffect(() => {
    if (data) {
      const savedPost = data.find((post: any) => post.id === postId);
      setIsSaved(!!savedPost);
    }
  }, [data, postId]);

  // حفظ المنشور
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        // محاولة استرداد المستخدم من localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            const userId = parsedUser.id;
            
            const res = await apiRequest("POST", `/api/community-posts/${postId}/save`, {
              userId: userId
            });
            
            return await res.json();
          } catch (e) {
            console.error("Error parsing user from localStorage:", e);
            throw new Error("يجب تسجيل الدخول لحفظ المنشورات");
          }
        } else {
          throw new Error("يجب تسجيل الدخول لحفظ المنشورات");
        }
      } else {
        const res = await apiRequest("POST", `/api/community-posts/${postId}/save`, {
          userId: user.id
        });
        
        return await res.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "saved-posts"] });
      toast({
        title: "تم الحفظ",
        description: "تم حفظ المنشور في المفضلة",
        variant: "default"
      });
      setIsSaved(true);
    },
    onError: (error: Error) => {
      toast({
        title: "حدث خطأ",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // إلغاء حفظ المنشور
  const unsaveMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        // محاولة استرداد المستخدم من localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            const userId = parsedUser.id;
            
            const res = await apiRequest("DELETE", `/api/community-posts/${postId}/save?userId=${userId}`);
            return await res.json();
          } catch (e) {
            console.error("Error parsing user from localStorage:", e);
            throw new Error("يجب تسجيل الدخول لإلغاء حفظ المنشورات");
          }
        } else {
          throw new Error("يجب تسجيل الدخول لإلغاء حفظ المنشورات");
        }
      } else {
        const res = await apiRequest("DELETE", `/api/community-posts/${postId}/save?userId=${user.id}`);
        return await res.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "saved-posts"] });
      toast({
        title: "تم إلغاء الحفظ",
        description: "تم إزالة المنشور من المفضلة",
        variant: "default"
      });
      setIsSaved(false);
    },
    onError: (error: Error) => {
      toast({
        title: "حدث خطأ",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // التبديل بين الحفظ وإلغاء الحفظ
  const handleToggleSave = () => {
    // التحقق من وجود مستخدم مسجل إما في context أو في localStorage
    const storedUser = localStorage.getItem("user");
    const isLoggedIn = user || storedUser;
    
    if (!isLoggedIn) {
      toast({
        title: "تنبيه",
        description: "يجب تسجيل الدخول أولاً لحفظ المنشورات",
        variant: "default"
      });
      return;
    }
    
    if (isSaved) {
      unsaveMutation.mutate();
    } else {
      saveMutation.mutate();
    }
  };

  // أثناء التحميل
  if (isLoading) {
    return (
      <Button variant={variant} size={size} disabled className="text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleSave}
      disabled={saveMutation.isPending || unsaveMutation.isPending}
      className={`${isSaved ? "text-yellow-500 hover:text-yellow-600" : "text-gray-500 hover:text-yellow-500"}`}
    >
      {isSaved ? (
        <BookmarkCheck className="h-4 w-4 mr-1" />
      ) : (
        <Bookmark className="h-4 w-4 mr-1" />
      )}
      {showText && (
        <span className="hidden md:inline">
          {isSaved ? "محفوظ" : "حفظ"}
        </span>
      )}
    </Button>
  );
}