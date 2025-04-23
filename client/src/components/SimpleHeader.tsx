import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { BookmarkIcon, LogIn, User as UserIcon, Menu, X, Shield, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggleButton from "./LanguageToggleButton";

export function SimpleHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, isLoading } = useAuth();
  const { isArabic, toggleLanguage } = useLanguage();
  
  // التحقق ما إذا كان المستخدم مشرفًا بشكل صريح
  const isAdmin = user?.isAdmin === true;
  
  // تسجيل للتشخيص
  console.log("SimpleHeader - User Info:", { user, isAdmin, isArabic });
  
  // إغلاق القائمة الجانبية عند تغيير الصفحة
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);
  
  return (
    <header className="fixed top-0 left-0 right-0 border-b bg-white z-50">
      <div className="container flex h-16 items-center justify-between py-4 px-4 md:px-6">
        <Link href="/">
          <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent cursor-pointer">
            {isArabic ? "كويك ريسب" : "Kuik Recipe"}
          </span>
        </Link>
        
        {/* قائمة للهواتف */}
        <button 
          className="block md:hidden z-50" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-600" />
          ) : (
            <Menu className="h-6 w-6 text-gray-600" />
          )}
        </button>
        
        {/* خلفية قاتمة عند فتح القائمة */}
        {mobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/20 z-40"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
        )}
        
        {/* قائمة للشاشات الكبيرة */}
        <div className="hidden md:flex items-center space-x-4 space-x-reverse">
          <Link href="/community-posts">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-orange-700 hover:text-orange-800 hover:bg-orange-50"
            >
              {isArabic ? "منشورات المجتمع" : "Community Posts"}
            </Button>
          </Link>
          
          {/* زر لوحة تحكم المشرفين - يظهر فقط للمشرفين */}
          {isAdmin && (
            <Link href="/admin-dashboard">
              <Button 
                variant="ghost" 
                size="sm" 
                className="bg-amber-100 text-amber-900 hover:bg-amber-200 gap-2 font-bold"
              >
                <Shield className="h-4 w-4" />
                {isArabic ? "لوحة المشرفين" : "Admin Dashboard"}
              </Button>
            </Link>
          )}
          
          {!isLoading && user && (
            <Link href="/saved-recipes">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-orange-700 hover:text-orange-800 hover:bg-orange-50 gap-2"
              >
                <BookmarkIcon className="h-4 w-4" />
                {isArabic ? "وصفاتي المحفوظة" : "My Saved Recipes"}
              </Button>
            </Link>
          )}
          
          {!isLoading ? (
            <div className="flex items-center gap-2">
              {/* زر تبديل اللغة - يظهر دائماً */}
              <LanguageToggleButton className="border-gray-300 hover:bg-gray-100" />
            
              {/* زر مدخل المشرفين - فقط للزوار أو المستخدمين العاديين (غير المشرفين) */}
              {!isAdmin && (
                <Link href="/admin-login">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2 text-amber-700 hover:text-amber-800 hover:bg-amber-50"
                  >
                    <Shield className="h-4 w-4" />
                    <span>{isArabic ? "مدخل المشرفين" : "Admin Login"}</span>
                  </Button>
                </Link>
              )}
              
              {/* إظهار زر تسجيل الدخول فقط إذا لم يكن المستخدم مسجل (سواء عادي أو مشرف) */}
              {!user && (
                <Link href="/auth">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>{isArabic ? "تسجيل الدخول" : "Sign In"}</span>
                  </Button>
                </Link>
              )}
              
              {/* إظهار زر الملف الشخصي فقط إذا كان المستخدم مسجل */}
              {user && (
                <Link href="/profile">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                  >
                    <UserIcon className="h-4 w-4" />
                    <span>{isArabic ? "الملف الشخصي" : "Profile"}</span>
                  </Button>
                </Link>
              )}
            </div>
          ) : null}
        </div>
      </div>
      
      {/* قائمة جانبية للهواتف */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-2 right-2 mx-auto w-[95%] rounded-lg bg-white border border-gray-200 shadow-xl z-50 max-h-[60vh] overflow-y-auto mt-2">
          <nav className="flex flex-col p-3 space-y-2">
            <Link href="/">
              <span className="block py-2 px-3 hover:bg-gray-100 rounded-md font-medium">
                {isArabic ? "الرئيسية" : "Home"}
              </span>
            </Link>
            <Link href="/community-posts">
              <span className="block py-2 px-3 hover:bg-gray-100 rounded-md text-orange-700 font-medium">
                {isArabic ? "منشورات المجتمع" : "Community Posts"}
              </span>
            </Link>
            
            {/* زر لوحة المشرفين للهواتف - فقط للمشرفين المسجلين */}
            {isAdmin && (
              <Link href="/admin-dashboard">
                <span className="block py-2 px-3 bg-amber-100 hover:bg-amber-200 rounded-md text-amber-900 font-bold flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  {isArabic ? "لوحة المشرفين" : "Admin Dashboard"}
                </span>
              </Link>
            )}

            {/* زر الوصفات المحفوظة للمستخدمين المسجلين */}
            {!isLoading && user && (
              <Link href="/saved-recipes">
                <span className="block py-2 px-3 hover:bg-gray-100 rounded-md text-orange-700 flex items-center gap-2">
                  <BookmarkIcon className="h-4 w-4" />
                  {isArabic ? "وصفاتي المحفوظة" : "My Saved Recipes"}
                </span>
              </Link>
            )}
            
            {!isLoading && (
              <>
                {/* زر تبديل اللغة - يظهر دائماً */}
                <div 
                  className="block py-2 px-3 hover:bg-blue-50 rounded-md text-blue-600 flex items-center gap-2 cursor-pointer"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setTimeout(() => {
                      // استخدم toggleLanguage الذي حصلنا عليه من useLanguage hook
                      toggleLanguage();
                    }, 100);
                  }}
                >
                  <Globe className="h-4 w-4 text-blue-500" />
                  {isArabic ? "English" : "العربية"}
                </div>
              
                {/* مدخل المشرفين - فقط للزوار أو المستخدمين العاديين (غير المشرفين) */}
                {!isAdmin && (
                  <Link href="/admin-login">
                    <span className="block py-2 px-3 hover:bg-amber-100 rounded-md text-amber-700 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      {isArabic ? "مدخل المشرفين" : "Admin Login"}
                    </span>
                  </Link>
                )}
                
                {/* تسجيل الدخول - فقط للزوار (غير المسجلين) */}
                {!user && (
                  <Link href="/auth">
                    <span className="block py-2 px-3 hover:bg-gray-100 rounded-md">
                      {isArabic ? "تسجيل الدخول" : "Sign In"}
                    </span>
                  </Link>
                )}
                
                {/* الملف الشخصي - فقط للمستخدمين المسجلين */}
                {user && (
                  <Link href="/profile">
                    <span className="block py-2 px-3 hover:bg-gray-100 rounded-md">
                      {isArabic ? "الملف الشخصي" : "Profile"}
                    </span>
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}