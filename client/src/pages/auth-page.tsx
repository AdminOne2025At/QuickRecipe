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
import { useAuth } from "@/hooks/use-auth";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, loginAsGuest, firebaseUser } = useAuth();
  
  // إذا كان المستخدم مسجل الدخول بالفعل، توجيه إلى الصفحة الرئيسية
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);
  
  // تحقق من حالة تسجيل الدخول عبر فايربيس
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
      }
    };
    
    // التحقق من نتيجة إعادة التوجيه
    checkAuthAndRedirect();
    
    // الاستماع لتغييرات حالة المصادقة
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLocation("/");
      }
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
      let errorMessage = "حدث خطأ أثناء محاولة تسجيل الدخول بحساب Google";
      
      if (error.code === 'auth/unauthorized-domain') {
        errorMessage = "النطاق غير مصرح به في Firebase. سيتم تسجيلك كزائر تلقائيًا.";
        
        // التحول لتسجيل دخول الزائر
        handleGuestLogin();
        return;
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "تم حظر نافذة تسجيل الدخول. الرجاء السماح بالنوافذ المنبثقة أو استخدام خيار 'تخطي'.";
      } else if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        // هذه ليست أخطاء حقيقية، فقط تنبيه المستخدم
        errorMessage = "تم إغلاق نافذة تسجيل الدخول قبل إكمال العملية.";
      }
      
      toast({
        title: "معلومات تسجيل الدخول",
        description: errorMessage,
        variant: error.code === 'auth/popup-closed-by-user' ? "default" : "destructive",
      });
      
      setIsLoading(false);
    }
  };
  
  // التعامل مع تسجيل الدخول كزائر (وضع زائر)
  const handleGuestLogin = async () => {
    try {
      console.log("🔑 تسجيل دخول كزائر - بدء العملية...");
      setIsLoading(true);
      
      // استخدام API مباشرة للتحايل على أي مشاكل في سياق المصادقة
      const response = await fetch('/api/guest/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({}),
        credentials: 'include' // مهم جداً لإرسال واستقبال الكوكيز
      });
      
      console.log("🔑 استجابة تسجيل دخول الزائر:", response.status, response.statusText);
      
      if (response.ok) {
        const userData = await response.json();
        console.log("🔑 تم تسجيل الدخول كزائر بنجاح:", userData);
        
        // إظهار رسالة للمستخدم
        toast({
          title: "تم تسجيل الدخول كزائر",
          description: "يمكنك الاستمتاع بالخدمات الأساسية",
          variant: "default"
        });
        
        // إعادة تحميل الصفحة للتأكد من تحديث الجلسة بشكل صحيح
        window.location.href = '/';
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "فشل تسجيل دخول الزائر");
      }
    } catch (error) {
      console.error("❌ خطأ في تسجيل دخول الزائر:", error);
      
      toast({
        title: "حدث خطأ",
        description: "حدث خطأ أثناء محاولة تسجيل الدخول كزائر.",
        variant: "destructive"
      });
      setIsLoading(false);
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
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 w-full" 
                onClick={handleSignIn}
                disabled={isLoading}
              >
                <FcGoogle className="h-5 w-5" /> 
                <span className="flex-1">تسجيل الدخول باستخدام Google</span>
              </Button>
              
              <div className="bg-amber-50 p-3 rounded-md border border-amber-200 text-xs">
                <p className="font-medium text-amber-800 mb-1">ملاحظة: تسجيل الدخول بجوجل معطل حاليًا</p>
                <p className="text-amber-700">
                  يجب إضافة نطاق الموقع إلى قائمة النطاقات المسموح بها في إعدادات Firebase.
                  يرجى استخدام خيار "تخطي تسجيل الدخول" أدناه.
                </p>
              </div>
            </div>
            
            <Button 
              onClick={handleGuestLogin} 
              variant="default" 
              className="w-full mb-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              دخول سريع (الخيار الموصى به)
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
            <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md border border-blue-200 text-sm">
              <p className="font-semibold mb-1">معلومات عن تسجيل الدخول:</p>
              <p>يعمل خيار "دخول سريع" على تمكينك من استخدام جميع وظائف التطبيق بسرعة دون الحاجة إلى حساب جوجل أو بريد إلكتروني. نوصي باستخدام هذا الخيار للتجربة الأفضل.</p>
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