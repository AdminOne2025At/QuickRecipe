import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { BookmarkIcon, LogIn, User, Menu, X, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

export function SimpleHeader() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user } = useAuth();
  
  // التحقق ما إذا كان المستخدم مشرفًا
  const isAdmin = user?.isAdmin === true;
  
  // debug
  console.log("SimpleHeader - User Info:", { user, isAdmin });
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  // إغلاق القائمة الجانبية عند تغيير الصفحة
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);
  
  return (
    <header className="relative border-b z-10">
      <div className="container flex h-16 items-center justify-between py-4 px-4 md:px-6">
        <Link href="/">
          <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent cursor-pointer">
            Quick Recipe
          </span>
        </Link>
        
        {/* قائمة للهواتف */}
        <button 
          className="block md:hidden" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-600" />
          ) : (
            <Menu className="h-6 w-6 text-gray-600" />
          )}
        </button>
        
        {/* قائمة للشاشات الكبيرة */}
        <div className="hidden md:flex items-center space-x-4 space-x-reverse">
          <Link href="/community-posts">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-orange-700 hover:text-orange-800 hover:bg-orange-50"
            >
              منشورات المجتمع
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
                لوحة المشرفين
              </Button>
            </Link>
          )}
          
          {!isLoading && currentUser && (
            <Link href="/saved-recipes">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-orange-700 hover:text-orange-800 hover:bg-orange-50 gap-2"
              >
                <BookmarkIcon className="h-4 w-4" />
                وصفاتي المحفوظة
              </Button>
            </Link>
          )}
          
          {!isLoading && !currentUser ? (
            <div className="flex items-center gap-2">
              <Link href="/admin-login">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2 text-amber-700 hover:text-amber-800 hover:bg-amber-50"
                >
                  <Shield className="h-4 w-4" />
                  <span>المشرفين</span>
                </Button>
              </Link>
              <Link href="/auth">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span>تسجيل الدخول</span>
                </Button>
              </Link>
            </div>
          ) : (
            <Link href="/profile">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
              >
                <User className="h-4 w-4" />
                <span>الملف الشخصي</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      {/* قائمة جانبية للهواتف */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute w-full bg-white border-b border-gray-200 shadow-lg">
          <nav className="flex flex-col p-4 space-y-3">
            <Link href="/">
              <span className="block py-2 px-3 hover:bg-gray-100 rounded-md">الرئيسية</span>
            </Link>
            <Link href="/community-posts">
              <span className="block py-2 px-3 hover:bg-gray-100 rounded-md text-orange-700">
                منشورات المجتمع
              </span>
            </Link>
            
            {/* زر لوحة المشرفين للهواتف */}
            {isAdmin && (
              <Link href="/admin-dashboard">
                <span className="block py-2 px-3 bg-amber-100 hover:bg-amber-200 rounded-md text-amber-900 font-bold flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  لوحة المشرفين
                </span>
              </Link>
            )}

            {!isLoading && currentUser && (
              <Link href="/saved-recipes">
                <span className="block py-2 px-3 hover:bg-gray-100 rounded-md text-orange-700 flex items-center gap-2">
                  <BookmarkIcon className="h-4 w-4" />
                  وصفاتي المحفوظة
                </span>
              </Link>
            )}
            
            {!isLoading && !currentUser ? (
              <>
                <Link href="/admin-login">
                  <span className="block py-2 px-3 hover:bg-amber-100 rounded-md text-amber-700 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    دخول المشرفين
                  </span>
                </Link>
                <Link href="/auth">
                  <span className="block py-2 px-3 hover:bg-gray-100 rounded-md">تسجيل الدخول</span>
                </Link>
              </>
            ) : (
              <Link href="/profile">
                <span className="block py-2 px-3 hover:bg-gray-100 rounded-md">الملف الشخصي</span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}