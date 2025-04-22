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
      console.log("Attempting admin login with:", { username, password: "***" });
      
      const res = await apiRequest("POST", "/api/admin/login", {
        username,
        password
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "فشل تسجيل الدخول كمشرف");
      }
      
      const userData = await res.json();
      console.log("Admin login successful, received data:", userData);
      
      // تأكد من أن حقل المشرف معين بشكل صريح
      if (userData.isAdmin !== true) {
        console.error("Error: Admin API returned user without isAdmin flag!");
        throw new Error("بيانات المشرف غير صالحة، يرجى الاتصال بالدعم الفني");
      }
      
      return userData;
    },
    onSuccess: (data) => {
      // تأكد من تخزين البيانات مع حقل isAdmin=true بشكل صريح
      const adminData = {
        ...data,
        isAdmin: true
      };
      
      console.log("Storing admin data in localStorage:", adminData);
      
      // حفظ بيانات المشرف في localStorage
      localStorage.setItem("user", JSON.stringify(adminData));
      
      // تحديث حالة المستخدم في React Query
      queryClient.setQueryData(["/api/user"], adminData);
      
      // إرسال إشعار تسجيل دخول للديسكورد (بدون انتظار النتيجة لتسريع العملية)
      try {
        fetch('/api/login/notify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: adminData.username,
            loginMethod: 'admin',
            userAgent: navigator.userAgent,
            isAdmin: true
          }),
        }).catch(err => console.error("فشل إرسال إشعار تسجيل الدخول:", err));
      } catch (notifyError) {
        console.error("خطأ عند إعداد إشعار تسجيل الدخول:", notifyError);
      }
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في لوحة تحكم المشرفين",
        variant: "default"
      });
      
      // تأخير أطول (5 ثوان) للتحقق من نجاح تسجيل الدخول وتحديث حالة المستخدم
      toast({
        title: "جاري التحقق...",
        description: "يرجى الانتظار... جاري التحقق من صلاحيات المشرف",
        variant: "default"
      });
      
      // عرض رسالة إضافية بعد ثانيتين
      setTimeout(() => {
        toast({
          title: "...لا تزال المعالجة جارية",
          description: "تتم الآن مزامنة جلسة المستخدم. يرجى الانتظار...",
          variant: "default"
        });
      }, 2000);
      
      // التحقق واتخاذ الإجراء بعد 5 ثوان (وقت كافٍ للتأكد من تحديث الحالة)
      setTimeout(() => {
        // التحقق من صلاحيات المشرف مرة أخرى قبل التوجيه
        const userCheck = JSON.parse(localStorage.getItem("user") || "{}");
        console.log("Final admin verification check:", userCheck);
        
        if (userCheck.isAdmin === true) {
          console.log("Admin verification successful, redirecting to dashboard...");
          
          // تحديث واجهة المستخدم مرة أخرى
          queryClient.invalidateQueries({ queryKey: ["/api/user"] });
          
          toast({
            title: "تم التحقق بنجاح!",
            description: "تم التحقق من صلاحيات المشرف. جاري التوجيه إلى لوحة التحكم...",
            variant: "success"
          });
          
          // التوجيه إلى لوحة المشرفين
          setTimeout(() => {
            window.location.href = "/admin-dashboard";
          }, 1000);
        } else {
          console.error("Admin verification failed after login!");
          toast({
            title: "فشل التحقق من صلاحيات المشرف",
            description: "حدث خطأ أثناء التحقق من صلاحيات المشرف. يرجى المحاولة مرة أخرى.",
            variant: "destructive"
          });
        }
      }, 5000);
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
                  <h2 className="text-2xl font-bold">مدخل المشرفين</h2>
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
            مرحبًا بك في لوحة تحكم المشرفين لتطبيق كويك ريسب. هذه المنطقة مخصصة للمشرفين فقط.
          </p>
          <p className="text-lg opacity-90">
            يمكنك من خلال هذه اللوحة إدارة المحتوى ومراقبة المنشورات وإدارة المستخدمين والإشراف على جميع أنشطة المنصة.
          </p>
        </div>
      </div>
    </div>
  );
}