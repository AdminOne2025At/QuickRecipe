import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { signInWithGoogle, handleRedirectResult } from "@/lib/firebase";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Loader2, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { language, isArabic } = useLanguage();
  
  // تحقق من حالة تسجيل الدخول ومعالجة نتيجة إعادة التوجيه
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        // التحقق من نتيجة إعادة التوجيه عند تحميل الصفحة
        const user = await handleRedirectResult();
        
        if (user) {
          // تم تسجيل الدخول بنجاح من خلال إعادة التوجيه
          toast({
            title: isArabic ? "تم تسجيل الدخول" : "Logged In",
            description: isArabic ? `مرحبًا ${user.displayName || 'بك'}!` : `Welcome ${user.displayName || 'back'}!`,
          });
          setLocation("/");
        }
      } catch (error: any) {
        console.error("Error handling auth redirect:", error);
        
        let errorMessage = isArabic 
          ? "حدث خطأ أثناء محاولة تسجيل الدخول بحساب Google" 
          : "An error occurred while trying to sign in with Google";
        
        // تحسين رسالة الخطأ بناءً على نوع الخطأ
        if (error.code === 'auth/unauthorized-domain') {
          errorMessage = isArabic
            ? `النطاق غير مصرح به. يجب على مدير التطبيق إضافة "${window.location.origin}" إلى قائمة النطاقات المصرح بها في إعدادات Firebase.`
            : `Unauthorized domain. The app admin must add "${window.location.origin}" to the list of authorized domains in Firebase settings.`;
        } else if (error.code === 'auth/popup-closed-by-user') {
          errorMessage = isArabic
            ? "تم إغلاق نافذة تسجيل الدخول قبل إكمال العملية."
            : "The sign-in window was closed before completing the process.";
        } else if (error.code === 'auth/cancelled-popup-request') {
          // هذا ليس خطأ فعلياً وغالباً ما يحدث عند فتح نافذة منبثقة جديدة
          errorMessage = ""; // استخدام سلسلة فارغة بدلاً من null
        } else if (error.code === 'auth/popup-blocked') {
          errorMessage = isArabic
            ? "تم حظر النافذة المنبثقة. يرجى السماح بالنوافذ المنبثقة لهذا الموقع."
            : "The popup was blocked. Please allow popups for this website.";
        }
        
        if (errorMessage) {
          toast({
            title: isArabic ? "خطأ في تسجيل الدخول" : "Login Error",
            description: errorMessage,
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    // التحقق من نتيجة إعادة التوجيه
    checkAuthAndRedirect();
    
    // الاستماع لتغييرات حالة المصادقة
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLocation("/");
      }
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, [setLocation, toast]);
  
  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      // لن يعود للتنفيذ هنا لأن signInWithRedirect يقوم بتحويل الصفحة
    } catch (error: any) {
      console.error('Login error:', error);
      
      // تعزيز معالجة الأخطاء الشائعة
      let errorMessage = isArabic
        ? "حدث خطأ أثناء محاولة تسجيل الدخول بحساب Google"
        : "An error occurred while trying to sign in with Google";
      
      if (error.code === 'auth/unauthorized-domain') {
        errorMessage = isArabic
          ? "النطاق غير مصرح به في Firebase. سيتم تسجيلك كزائر تلقائيًا."
          : "Unauthorized domain in Firebase. You will be logged in as a guest automatically.";
        
        // التحول لتسجيل دخول الزائر
        handleGuestLogin();
        return;
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = isArabic
          ? "تم حظر نافذة تسجيل الدخول. الرجاء السماح بالنوافذ المنبثقة أو استخدام خيار 'تخطي'."
          : "Sign-in popup was blocked. Please allow popups or use the 'Quick Login' option.";
      } else if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        // هذه ليست أخطاء حقيقية، فقط تنبيه المستخدم
        errorMessage = isArabic
          ? "تم إغلاق نافذة تسجيل الدخول قبل إكمال العملية."
          : "The sign-in window was closed before completing the process.";
      }
      
      toast({
        title: isArabic ? "معلومات تسجيل الدخول" : "Login Information",
        description: errorMessage,
        variant: error.code === 'auth/popup-closed-by-user' ? "default" : "destructive",
      });
      
      setIsLoading(false);
    }
  };
  
  // التعامل مع تسجيل الدخول كزائر (وضع زائر)
  const handleGuestLogin = () => {
    try {
      // إنشاء بيانات مستخدم زائر
      const guestUser = {
        id: 1, // استخدام معرف المستخدم الافتراضي
        username: isArabic ? "زائر" : "Guest",
        isGuest: true
      };
      
      // تخزين بيانات المستخدم الزائر في localStorage
      localStorage.setItem("user", JSON.stringify(guestUser));
      
      // تحديث React Query
      queryClient.setQueryData(["/api/user"], guestUser);
      
      // إرسال إشعار تسجيل دخول للديسكورد (بدون انتظار النتيجة لتسريع العملية)
      try {
        fetch('/api/login/notify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: guestUser.username,
            loginMethod: 'guest',
            userAgent: navigator.userAgent,
            isGuest: true
          }),
        }).catch(err => console.error(isArabic ? "فشل إرسال إشعار تسجيل الدخول:" : "Failed to send login notification:", err));
      } catch (notifyError) {
        console.error(isArabic ? "خطأ عند إعداد إشعار تسجيل الدخول:" : "Error setting up login notification:", notifyError);
      }
      
      toast({
        title: isArabic ? "تم تسجيل الدخول كزائر" : "Logged in as Guest",
        description: isArabic 
          ? "يمكنك الآن استخدام الموقع. بعض الميزات قد تكون محدودة." 
          : "You can now use the site. Some features may be limited.",
        variant: "default"
      });
      
      // التوجيه إلى الصفحة الرئيسية
      setLocation("/");
    } catch (error) {
      console.error("Error logging in as guest:", error);
      
      toast({
        title: isArabic ? "حدث خطأ" : "Error",
        description: isArabic 
          ? "حدث خطأ أثناء محاولة تسجيل الدخول كزائر." 
          : "An error occurred while trying to log in as a guest.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex min-h-[80vh] w-full flex-col md:flex-row" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* قسم النموذج */}
      <div className="flex w-full flex-1 items-center justify-center p-4 md:w-1/2">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold">{translations['welcomeToQuickRecipe'][language]}</CardTitle>
            <CardDescription>{translations['loginForSpecialFeatures'][language]}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 w-full" 
                onClick={handleSignIn}
                disabled={isLoading}
              >
                <FcGoogle className="h-5 w-5" /> 
                <span className="flex-1">{translations['loginWithGoogle'][language]}</span>
              </Button>
              
              <div className="bg-amber-50 p-3 rounded-md border border-amber-200 text-xs">
                <p className="font-medium text-amber-800 mb-1">{translations['noteGoogleDisabled'][language]}</p>
                <p className="text-amber-700">
                  {translations['googleLoginInstructions'][language]}
                </p>
              </div>
            </div>
            
            <Button 
              onClick={handleGuestLogin} 
              variant="default" 
              className="w-full mb-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              {translations['quickLogin'][language]}
            </Button>
            
            <Button
              onClick={() => setLocation('/admin-login')}
              variant="ghost"
              className="w-full border border-gray-200 hover:bg-amber-50 flex items-center gap-2"
            >
              <Shield className="h-4 w-4 text-amber-500" />
              <span className="flex-1">{translations['adminLogin'][language]}</span>
            </Button>
          </CardContent>
          <CardContent>
            <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md border border-blue-200 text-sm">
              <p className="font-semibold mb-1">{translations['loginInfoTitle'][language]}</p>
              <p>{translations['quickLoginDescription'][language]}</p>
            </div>
          </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground">
            {translations['termsAgreement'][language]}
          </CardFooter>
        </Card>
      </div>

      {/* قسم الترحيب */}
      <div className="hidden w-full bg-gradient-to-r from-orange-100 to-amber-100 p-8 md:flex md:w-1/2 md:flex-col md:items-center md:justify-center">
        <div className="mx-auto max-w-md text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-orange-600">
            {translations['discoverTitle'][language]}
          </h1>
          <p className="mb-6 text-lg text-gray-700">
            {translations['appDescription'][language]}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-white p-4 shadow-md">
              <h3 className="mb-1 font-semibold text-orange-500">{translations['saveFavorites'][language]}</h3>
              <p className="text-sm text-gray-600">{translations['saveFavoritesDesc'][language]}</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-md">
              <h3 className="mb-1 font-semibold text-orange-500">{translations['customizePreferences'][language]}</h3>
              <p className="text-sm text-gray-600">{translations['customizePreferencesDesc'][language]}</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-md">
              <h3 className="mb-1 font-semibold text-orange-500">{translations['ingredientSubstitutionsTitle'][language]}</h3>
              <p className="text-sm text-gray-600">{translations['ingredientSubstitutionsDesc'][language]}</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-md">
              <h3 className="mb-1 font-semibold text-orange-500">{translations['crossDeviceSync'][language]}</h3>
              <p className="text-sm text-gray-600">{translations['crossDeviceSyncDesc'][language]}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}