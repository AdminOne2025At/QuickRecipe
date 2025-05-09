import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations, Language } from "@/lib/translations";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Loader2, Sparkles } from "lucide-react";
import LanguageToggleButton from "@/components/LanguageToggleButton";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const { language, isArabic } = useLanguage();
  
  // تحديد اللغة الافتراضية في حالة عدم تعريف اللغة
  const defaultLang: Language = 'ar-EG';
  
  // دالة مساعدة للحصول على النص حسب اللغة المتاحة
  const getTranslatedText = (key: string, fallbackText: string) => {
    if (!language || !translations[key]) return fallbackText;
    return translations[key][language] || translations[key][defaultLang] || fallbackText;
  };
  
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
        title: getTranslatedText('loginSuccess', 'تم تسجيل الدخول بنجاح'),
        description: getTranslatedText('welcomeAdmin', 'مرحباً بك في لوحة تحكم المشرف'),
        variant: "default"
      });
      
      // تأخير أطول للتحقق من نجاح تسجيل الدخول وتحديث حالة المستخدم
      toast({
        title: getTranslatedText('verifying', 'جاري التحقق'),
        description: getTranslatedText('pleaseWait', 'يرجى الانتظار...'),
        variant: "default"
      });
      
      // عرض رسالة إضافية بعد ثانيتين
      setTimeout(() => {
        toast({
          title: getTranslatedText('processingContinues', 'جاري المعالجة'),
          description: getTranslatedText('synchronizingSession', 'مزامنة الجلسة...'),
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
            title: getTranslatedText('verificationSuccess', 'تم التحقق بنجاح'),
            description: getTranslatedText('redirectingToDashboard', 'جاري التوجيه إلى لوحة التحكم...'),
            variant: "default"
          });
          
          // التوجيه إلى لوحة المشرفين
          setTimeout(() => {
            window.location.href = "/admin-dashboard";
          }, 1000);
        } else {
          console.error("Admin verification failed after login!");
          toast({
            title: getTranslatedText('verificationFailed', 'فشل التحقق'),
            description: getTranslatedText('verificationError', 'حدث خطأ أثناء التحقق، يرجى المحاولة مرة أخرى'),
            variant: "destructive"
          });
        }
      }, 5000);
    },
    onError: (error: Error) => {
      toast({
        title: getTranslatedText('loginError', 'خطأ في تسجيل الدخول'),
        description: error.message || getTranslatedText('checkCredentials', 'يرجى التحقق من بيانات الاعتماد الخاصة بك'),
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast({
        title: getTranslatedText('dataError', 'خطأ في البيانات'),
        description: getTranslatedText('pleaseEnterCredentials', 'يرجى إدخال اسم المستخدم وكلمة المرور'),
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
                    {getTranslatedText('adminEntrance', 'بوابة دخول المشرفين')}
                  </h2>
                </div>
                <p className="text-gray-500 text-sm">
                  {getTranslatedText('adminPanelOnly', 'مخصص للمشرفين فقط')}
                </p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-username">{getTranslatedText('username', 'اسم المستخدم')}</Label>
                    <Input
                      id="admin-username"
                      placeholder={getTranslatedText('enterUsername', 'أدخل اسم المستخدم')}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      dir={isArabic ? 'rtl' : 'ltr'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">{getTranslatedText('password', 'كلمة المرور')}</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder={getTranslatedText('enterPassword', 'أدخل كلمة المرور')}
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
                        {getTranslatedText('loggingIn', 'جاري تسجيل الدخول...')}
                      </>
                    ) : (
                      getTranslatedText('loginAsAdmin', 'تسجيل الدخول كمشرف')
                    )}
                  </Button>
                </div>
              </form>
              
              <div className="mt-4 space-y-3 text-center">
                <div className="flex justify-center">
                  <LanguageToggleButton className="w-full" />
                </div>
                <a
                  href="/"
                  className="text-sm text-amber-600 hover:text-amber-800 inline-block"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/";
                  }}
                >
                  {getTranslatedText('returnToHomepage', 'العودة للصفحة الرئيسية')}
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
            {getTranslatedText('adminDashboard', 'لوحة تحكم المشرفين')}
          </h1>
          <p className="text-xl mb-4">
            {getTranslatedText('adminWelcome', 'مرحباً بك في لوحة تحكم المشرفين')}
          </p>
          <p className="text-lg opacity-90">
            {getTranslatedText('adminCapabilities', 'يمكنك إدارة المحتوى والبيانات والمستخدمين من هنا')}
          </p>
        </div>
      </div>
    </div>
  );
}