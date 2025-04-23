import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";

import { Button } from "@/components/ui/button";
import { Trash2, AlertCircle, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/contexts/LanguageContext";
import translations from "@/lib/translations";

interface AdminDeletePostButtonProps {
  postId: number;
  postTitle?: string;
  onSuccess?: () => void;
}

export default function AdminDeletePostButton({ postId, postTitle, onSuccess }: AdminDeletePostButtonProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Check admin privileges
  if (!user || user.isAdmin !== true) {
    return null;
  }

  const deletePostMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("DELETE", `/api/admin/posts/${postId}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || translations['postDeleteFailed'][language]);
      }
      return true;
    },
    onSuccess: () => {
      // Update all post queries
      queryClient.invalidateQueries({ queryKey: ["/api/community-posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/community-posts/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/community-posts/trending"] });
      
      toast({
        title: translations['postDeleted'][language],
        description: translations['postDeletedSuccess'][language],
        variant: "default"
      });
      
      setIsDialogOpen(false);
      
      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: Error) => {
      toast({
        title: translations['postDeleteFailed'][language],
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
        <span className="hidden md:inline">{translations['deletePost'][language]} ({translations['admin'][language]})</span>
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              {translations['confirmDeletePost'][language]}
            </DialogTitle>
            <DialogDescription>
              {translations['confirmDeletePostMessage'][language].replace('{postTitle}', postTitle || translations['noTitlePost'][language])}
              {translations['irreversibleAction'][language]}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={deletePostMutation.isPending}
            >
              {translations['cancel'][language]}
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
                  {translations['deleting'][language]}
                </>
              ) : (
                translations['confirmDelete'][language]
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}