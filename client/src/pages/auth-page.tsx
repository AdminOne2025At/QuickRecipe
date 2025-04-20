import { useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";

export default function AuthPage() {
  const { currentUser, signIn, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // إذا كان المستخدم مسجل الدخول، قم بتحويله إلى الصفحة الرئيسية
  useEffect(() => {
    if (currentUser) {
      setLocation("/");
    }
  }, [currentUser, setLocation]);

  return (
    <div className="flex min-h-[80vh] w-full flex-col md:flex-row">
      {/* قسم النموذج */}
      <div className="flex w-full flex-1 items-center justify-center p-4 md:w-1/2">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold">مرحباً بك في Fast Recipe</CardTitle>
            <CardDescription>سجل دخولك للوصول إلى مميزات خاصة</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-2" 
              onClick={signIn}
              disabled={isLoading}
            >
              <FcGoogle className="h-5 w-5" /> 
              <span className="flex-1">تسجيل الدخول باستخدام Google</span>
            </Button>
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
            مع Fast Recipe، يمكنك إيجاد وصفات لذيذة باستخدام المكونات المتاحة لديك.
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