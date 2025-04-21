import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

import AdminLoginForm from "@/components/AdminLoginForm";
import { Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const [_, setLocation] = useLocation();
  const { user } = useAuth();
  
  // إذا كان المستخدم مسجل الدخول بالفعل، انتقل إلى الصفحة الرئيسية
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  return (
    <div className="min-h-screen flex flex-col-reverse md:flex-row">
      {/* نموذج تسجيل الدخول */}
      <div className="w-full md:w-1/2 p-6 flex items-center justify-center bg-white">
        <div className="w-full max-w-md">
          <AdminLoginForm />
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