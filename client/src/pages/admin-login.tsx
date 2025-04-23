import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Loader2, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const { language, isArabic } = useLanguage();
  
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
        id: 5, // إجبار المعرّف ليكون 5 (مطابق للمستخدم في قاعدة البيانات)
        isAdmin: true
      };
      
      console.log("Storing admin data in localStorage:", adminData);
      
      // حفظ بيانات المشرف في localStorage
      localStorage.setItem("user", JSON.stringify(adminData));
      
      // تحديث حالة المستخدم في React Query
      queryClient.setQueryData(["/api/user"], adminData);
      
      // إرسال إشعار تسجيل دخول للديسكورد
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
        }).catch(err => console.error("Failed to send login notification:", err));
      } catch (notifyError) {
        console.error("Error setting up login notification:", notifyError);
      }
      
      toast({
        title: translations['loginSuccess'][language],
        description: translations['welcomeAdmin'][language],
        variant: "default"
      });
      
      // تأخير أطول للتحقق من نجاح تسجيل الدخول وتحديث حالة المستخدم
      toast({
        title: translations['verifying'][language],
        description: translations['pleaseWait'][language],
        variant: "default"
      });
      
      // عرض رسالة إضافية بعد ثانيتين
      setTimeout(() => {
        toast({
          title: translations['processingContinues'][language],
          description: translations['synchronizingSession'][language],
          variant: "default"
        });
      }, 2000);
      
      // التحقق واتخاذ الإجراء بعد 5 ثوان
      setTimeout(() => {
        // التحقق من صلاحيات المشرف مرة أخرى قبل التوجيه
        const userCheck = JSON.parse(localStorage.getItem("user") || "{}");
        console.log("Final admin verification check:", userCheck);
        
        if (userCheck.isAdmin === true) {
          console.log("Admin verification successful, redirecting to dashboard...");
          
          // تحديث واجهة المستخدم مرة أخرى
          queryClient.invalidateQueries({ queryKey: ["/api/user"] });
          
          toast({
            title: translations['verificationSuccess'][language],
            description: translations['redirectingToDashboard'][language],
            variant: "default"
          });
          
          // التوجيه إلى لوحة المشرفين
          setTimeout(() => {
            window.location.href = "/admin-dashboard";
          }, 1000);
        } else {
          console.error("Admin verification failed after login!");
          toast({
            title: translations['verificationFailed'][language],
            description: translations['verificationError'][language],
            variant: "destructive"
          });
        }
      }, 5000);
    },
    onError: (error: Error) => {
      toast({
        title: translations['loginError'][language],
        description: error.message || translations['checkCredentials'][language],
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast({
        title: translations['dataError'][language],
        description: translations['pleaseEnterCredentials'][language],
        variant: "destructive"
      });
      return;
    }
    
    adminLoginMutation.mutate();
  };

  return (
    <div className="min-h-screen flex flex-col-reverse md:flex-row" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Login Form */}
      <div className="w-full md:w-1/2 p-6 flex items-center justify-center bg-white">
        <div className="w-full max-w-md">
          <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-2">
                  <Shield className={`h-5 w-5 ${isArabic ? 'ml-2' : 'mr-2'} text-amber-500`} />
                  <h2 className="text-2xl font-bold">
                    {language ? translations['adminEntrance'][language] : 'بوابة دخول المشرفين'}
                  </h2>
                </div>
                <p className="text-gray-500 text-sm">
                  {language && translations['adminPanelOnly'] ? translations['adminPanelOnly'][language] : 'مخصص للمشرفين فقط'}
                </p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-username">{language ? translations['username'][language] : 'اسم المستخدم'}</Label>
                    <Input
                      id="admin-username"
                      placeholder={language ? translations['enterUsername'][language] : 'أدخل اسم المستخدم'}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      dir={isArabic ? 'rtl' : 'ltr'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">{language ? translations['password'][language] : 'كلمة المرور'}</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder={language ? translations['enterPassword'][language] : 'أدخل كلمة المرور'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      dir={isArabic ? 'rtl' : 'ltr'}
                    />
                  </div>
                
                  <Button 
                    type="submit" 
                    className="w-full bg-amber-500 hover:bg-amber-600"
                    disabled={adminLoginMutation.isPending}
                  >
                    {adminLoginMutation.isPending ? (
                      <>
                        <Loader2 className={`h-4 w-4 animate-spin ${isArabic ? 'ml-2' : 'mr-2'}`} />
                        {language ? translations['loggingIn'][language] : 'جاري تسجيل الدخول...'}
                      </>
                    ) : (
                      language ? translations['loginAsAdmin'][language] : 'تسجيل الدخول كمشرف'
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
                  {language ? translations['returnToHomepage'][language] : 'العودة للصفحة الرئيسية'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-amber-400 to-orange-600 p-8 flex flex-col justify-center text-white">
        <div className="max-w-lg mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Sparkles className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-6">
            {language ? translations['adminDashboard'][language] : 'لوحة تحكم المشرفين'}
          </h1>
          <p className="text-xl mb-4">
            {language ? translations['adminWelcome'][language] : 'مرحباً بك في لوحة تحكم المشرفين'}
          </p>
          <p className="text-lg opacity-90">
            {language ? translations['adminCapabilities'][language] : 'يمكنك إدارة المحتوى والبيانات والمستخدمين من هنا'}
          </p>
        </div>
      </div>
    </div>
  );
}