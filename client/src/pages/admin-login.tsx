import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Loader2, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  
  const adminLoginMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/login", {
        username,
        password
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "فشل تسجيل الدخول كمشرف");
      }
      
      return await res.json();
    },
    onSuccess: (data) => {
      // حفظ بيانات المشرف في localStorage مع الإشارة إلى isAdmin = true
      localStorage.setItem("user", JSON.stringify(data));
      
      // تحديث حالة المستخدم في React Query
      queryClient.setQueryData(["/api/user"], data);
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في لوحة تحكم المشرفين",
        variant: "default"
      });
      
      // استخدام window.location بدلاً من wouter's setLocation
      window.location.href = "/admin-dashboard";
    },
    onError: (error: Error) => {
      toast({
        title: "فشل تسجيل الدخول",
        description: error.message || "يرجى التحقق من اسم المستخدم وكلمة المرور",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال اسم المستخدم وكلمة المرور",
        variant: "destructive"
      });
      return;
    }
    
    adminLoginMutation.mutate();
  };

  return (
    <div className="min-h-screen flex flex-col-reverse md:flex-row">
      {/* نموذج تسجيل الدخول */}
      <div className="w-full md:w-1/2 p-6 flex items-center justify-center bg-white">
        <div className="w-full max-w-md">
          <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-2">
                  <Shield className="h-5 w-5 mr-2 text-amber-500" />
                  <h2 className="text-2xl font-bold">تسجيل دخول المشرفين</h2>
                </div>
                <p className="text-gray-500 text-sm">
                  لوحة التحكم الخاصة بالمشرفين فقط
                </p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-username">اسم المستخدم</Label>
                    <Input
                      id="admin-username"
                      placeholder="أدخل اسم المستخدم"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      dir="rtl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">كلمة المرور</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="أدخل كلمة المرور"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      dir="rtl"
                    />
                  </div>
                
                  <Button 
                    type="submit" 
                    className="w-full bg-amber-500 hover:bg-amber-600"
                    disabled={adminLoginMutation.isPending}
                  >
                    {adminLoginMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        جاري تسجيل الدخول...
                      </>
                    ) : (
                      "تسجيل الدخول كمشرف"
                    )}
                  </Button>
                </div>
              </form>
              
              <div className="mt-4 text-center">
                <a
                  href="/"
                  className="text-sm text-amber-600 hover:text-amber-800"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/";
                  }}
                >
                  العودة إلى الصفحة الرئيسية
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* قسم الترحيب */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-amber-400 to-orange-600 p-8 flex flex-col justify-center text-white">
        <div className="max-w-lg mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Sparkles className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-6">لوحة تحكم المشرفين</h1>
          <p className="text-xl mb-4">
            مرحبًا بك في لوحة تحكم المشرفين لتطبيق كويك ريسيبي. هذه المنطقة مخصصة للمشرفين فقط.
          </p>
          <p className="text-lg opacity-90">
            يمكنك من خلال هذه اللوحة إدارة المحتوى ومراقبة المنشورات وإدارة المستخدمين والإشراف على جميع أنشطة المنصة.
          </p>
        </div>
      </div>
    </div>
  );
}