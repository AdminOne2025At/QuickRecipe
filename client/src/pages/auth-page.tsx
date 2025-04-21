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

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // تحقق من حالة تسجيل الدخول ومعالجة نتيجة إعادة التوجيه
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        // التحقق من نتيجة إعادة التوجيه عند تحميل الصفحة
        const user = await handleRedirectResult();
        
        if (user) {
          // تم تسجيل الدخول بنجاح من خلال إعادة التوجيه
          toast({
            title: "تم تسجيل الدخول",
            description: `مرحبًا ${user.displayName || 'بك'}!`,
          });
          setLocation("/");
        }
      } catch (error: any) {
        console.error("Error handling auth redirect:", error);
        
        let errorMessage = "حدث خطأ أثناء محاولة تسجيل الدخول بحساب Google";
        
        // تحسين رسالة الخطأ بناءً على نوع الخطأ
        if (error.code === 'auth/unauthorized-domain') {
          errorMessage = `النطاق غير مصرح به. يجب على مدير التطبيق إضافة "${window.location.origin}" إلى قائمة النطاقات المصرح بها في إعدادات Firebase.`;
        } else if (error.code === 'auth/popup-closed-by-user') {
          errorMessage = "تم إغلاق نافذة تسجيل الدخول قبل إكمال العملية.";
        } else if (error.code === 'auth/cancelled-popup-request') {
          // هذا ليس خطأ فعلياً وغالباً ما يحدث عند فتح نافذة منبثقة جديدة
          errorMessage = ""; // استخدام سلسلة فارغة بدلاً من null
        } else if (error.code === 'auth/popup-blocked') {
          errorMessage = "تم حظر النافذة المنبثقة. يرجى السماح بالنوافذ المنبثقة لهذا الموقع.";
        }
        
        if (errorMessage) {
          toast({
            title: "خطأ في تسجيل الدخول",
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
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "حدث خطأ أثناء محاولة تسجيل الدخول بحساب Google",
        variant: "destructive",
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
        username: "زائر",
        isGuest: true
      };
      
      // تخزين بيانات المستخدم الزائر في localStorage
      localStorage.setItem("user", JSON.stringify(guestUser));
      
      // تحديث React Query
      queryClient.setQueryData(["/api/user"], guestUser);
      
      toast({
        title: "تم تسجيل الدخول كزائر",
        description: "يمكنك الآن استخدام الموقع. بعض الميزات قد تكون محدودة.",
        variant: "default"
      });
      
      // التوجيه إلى الصفحة الرئيسية
      setLocation("/");
    } catch (error) {
      console.error("Error logging in as guest:", error);
      
      toast({
        title: "حدث خطأ",
        description: "حدث خطأ أثناء محاولة تسجيل الدخول كزائر.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex min-h-[80vh] w-full flex-col md:flex-row">
      {/* قسم النموذج */}
      <div className="flex w-full flex-1 items-center justify-center p-4 md:w-1/2">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold">مرحباً بك في Quick Recipe</CardTitle>
            <CardDescription>سجل دخولك للوصول إلى مميزات خاصة</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 mb-2" 
              onClick={handleSignIn}
              disabled={isLoading}
            >
              <FcGoogle className="h-5 w-5" /> 
              <span className="flex-1">تسجيل الدخول باستخدام Google</span>
            </Button>
            
            <Button 
              onClick={handleGuestLogin} 
              variant="secondary" 
              className="w-full mb-2"
            >
              تخطي تسجيل الدخول والاستمرار كزائر
            </Button>
            
            <Button
              onClick={() => setLocation('/admin-login')}
              variant="ghost"
              className="w-full border border-gray-200 hover:bg-amber-50 flex items-center gap-2"
            >
              <Shield className="h-4 w-4 text-amber-500" />
              <span className="flex-1">دخول المشرفين</span>
            </Button>
          </CardContent>
          <CardContent>
            <div className="mt-4 p-3 bg-amber-50 text-amber-800 rounded-md border border-amber-200 text-sm">
              <p className="font-semibold mb-1">ملاحظة هامة:</p>
              <p>إذا واجهت مشكلة في تسجيل الدخول، يمكنك استخدام خيار "تخطي تسجيل الدخول" للاستمرار استخدام التطبيق. للحصول على جميع المميزات، يرجى المحاولة لاحقًا أو استخدام متصفح آخر.</p>
            </div>
          </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground">
            بالتسجيل، أنت توافق على شروط الاستخدام وسياسة الخصوصية
          </CardFooter>
        </Card>
      </div>

      {/* قسم الترحيب */}
      <div className="hidden w-full bg-gradient-to-r from-orange-100 to-amber-100 p-8 md:flex md:w-1/2 md:flex-col md:items-center md:justify-center">
        <div className="mx-auto max-w-md text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-orange-600">
            اكتشف وصفات جديدة وشهية
          </h1>
          <p className="mb-6 text-lg text-gray-700">
            مع Quick Recipe، يمكنك إيجاد وصفات لذيذة باستخدام المكونات المتاحة لديك.
            سجّل دخولك للحصول على إمكانية حفظ وصفاتك المفضلة، وتخصيص تفضيلاتك، والمزيد!
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-white p-4 shadow-md">
              <h3 className="mb-1 font-semibold text-orange-500">حفظ المفضلة</h3>
              <p className="text-sm text-gray-600">احفظ وصفاتك المفضلة للرجوع إليها لاحقًا</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-md">
              <h3 className="mb-1 font-semibold text-orange-500">تخصيص التفضيلات</h3>
              <p className="text-sm text-gray-600">خصص تفضيلاتك الغذائية للحصول على اقتراحات مناسبة</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-md">
              <h3 className="mb-1 font-semibold text-orange-500">بدائل المكونات</h3>
              <p className="text-sm text-gray-600">احصل على اقتراحات لبدائل المكونات غير المتوفرة</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-md">
              <h3 className="mb-1 font-semibold text-orange-500">مزامنة عبر الأجهزة</h3>
              <p className="text-sm text-gray-600">استمتع بتجربة سلسة عبر جميع أجهزتك</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}