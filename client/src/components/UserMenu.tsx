import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useLocation } from "wouter";
import { LogIn, LogOut, Settings, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export function UserMenu() {
  const { user, firebaseUser, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { language, isArabic } = useLanguage();

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <span className="h-5 w-5 rounded-full bg-muted animate-pulse"></span>
      </Button>
    );
  }

  if (!user) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => window.location.href = '/auth'}
        className="gap-2"
      >
        <LogIn className="h-4 w-4" />
        <span>{translations.signIn[language]}</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
            <AvatarFallback>
              {user.displayName ? user.displayName.slice(0, 2) : "UN"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.displayName && (
              <p className="font-medium">{user.displayName}</p>
            )}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => window.location.href = "/profile"} className="gap-2 cursor-pointer">
          <User className="h-4 w-4" />
          <span>{translations.profile[language]}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.location.href = "/profile?tab=preferences"} className="gap-2 cursor-pointer">
          <Settings className="h-4 w-4" />
          <span>{translations.settingsUserMenu[language]}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={async () => {
            try {
              // إرسال إشعار تسجيل الخروج قبل حذف بيانات المستخدم من التخزين المحلي
              if (user) {
                const response = await fetch('/api/login/notify', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    username: user.displayName || user.email || 'مستخدم غير معروف',
                    loginMethod: user.isAdmin ? 'admin' : (user.email?.includes('@gmail.com') ? 'google' : 'guest'),
                    userAgent: navigator.userAgent,
                    isAdmin: !!user.isAdmin,
                    email: user.email || undefined,
                    isLogout: true // علامة لتمييز أن هذا طلب تسجيل خروج
                  })
                });
                console.log('Logout notification sent:', await response.json());
              }
            } catch (error) {
              console.error('Failed to send logout notification:', error);
            } finally {
              // المتابعة بتسجيل الخروج بغض النظر عن نجاح إرسال الإشعار
              localStorage.removeItem('user');
              window.location.href = '/auth';
            }
          }} 
          className="text-red-600 gap-2 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>{translations.logOut[language]}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}