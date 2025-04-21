import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Flag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export interface ReportPostDialogProps {
  postId: number;
  onClose?: () => void;
}

export default function ReportPostDialog({ postId, onClose }: ReportPostDialogProps) {
  const [reason, setReason] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const reportMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("يجب تسجيل الدخول للإبلاغ عن المنشورات");
      
      const res = await apiRequest("POST", `/api/community-posts/${postId}/report`, {
        userId: user.id,
        reason
      });
      
      return await res.json();
    },
    onSuccess: () => {
      // تحديث قائمة المنشورات
      queryClient.invalidateQueries({ queryKey: ["/api/community-posts"] });
      toast({
        title: "تم الإبلاغ بنجاح",
        description: "شكراً لمساعدتنا في الحفاظ على بيئة آمنة. تم إرسال البلاغ إلى المشرفين وسيتم مراجعته قريبًا.",
        variant: "default"
      });
      setReason("");
      setIsOpen(false);
      if (onClose) onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "حدث خطأ",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال سبب الإبلاغ",
        variant: "destructive"
      });
      return;
    }
    
    reportMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
          <Flag className="h-4 w-4 mr-1" />
          <span className="hidden md:inline">إبلاغ</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>الإبلاغ عن منشور</DialogTitle>
          <DialogDescription>
            ساعدنا في الحفاظ على مجتمع آمن ومناسب بالإبلاغ عن المحتوى المخالف للقواعد.
            سيتم مراجعة البلاغات من قبل المشرفين وإرسالها إلى سيرفر Discord للمتابعة.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="py-4">
            <Textarea
              placeholder="يرجى ذكر سبب الإبلاغ..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="resize-none min-h-[100px]"
              dir="rtl"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={reportMutation.isPending}
            >
              إلغاء
            </Button>
            <Button 
              type="submit" 
              disabled={reportMutation.isPending}
              className="bg-red-500 hover:bg-red-600"
            >
              {reportMutation.isPending ? "جارٍ الإرسال..." : "إرسال البلاغ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}