import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";

import { Button } from "@/components/ui/button";
import { Trash2, AlertCircle, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AdminDeletePostButtonProps {
  postId: number;
}

export default function AdminDeletePostButton({ postId }: AdminDeletePostButtonProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // التحقق من صلاحيات المشرف
  if (!user || user.isAdmin !== true) {
    return null;
  }

  const deletePostMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("DELETE", `/api/admin/posts/${postId}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "فشل حذف المنشور");
      }
      return true;
    },
    onSuccess: () => {
      // تحديث جميع استعلامات المنشورات
      queryClient.invalidateQueries({ queryKey: ["/api/community-posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/community-posts/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/community-posts/trending"] });
      
      toast({
        title: "تم حذف المنشور",
        description: "تم حذف المنشور بنجاح من قبل المشرف",
        variant: "default"
      });
      
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "فشل حذف المنشور",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleDeleteClick = () => {
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    deletePostMutation.mutate();
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-gray-500 hover:text-red-600"
        onClick={handleDeleteClick}
      >
        <Trash2 className="h-4 w-4 mr-1" />
        <span className="hidden md:inline">حذف (مشرف)</span>
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              تأكيد حذف المنشور
            </DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف هذا المنشور؟ هذا الإجراء لا يمكن التراجع عنه.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={deletePostMutation.isPending}
            >
              إلغاء
            </Button>
            <Button 
              type="button" 
              variant="destructive"
              disabled={deletePostMutation.isPending}
              onClick={handleConfirmDelete}
            >
              {deletePostMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                "تأكيد الحذف"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}