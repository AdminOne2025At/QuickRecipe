import { Switch, Route, useLocation } from "wouter";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import AuthPage from "@/pages/auth-page";
import ProfilePage from "@/pages/profile-page";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, ReactNode } from "react";
import { HeaderWithAuth } from "@/components/HeaderWithAuth";

// هيكل الصفحة المشترك مع تسجيل الدخول
function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <HeaderWithAuth />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-right">
            &copy; 2025 Fast Recipe by Egyptco. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
}

// حماية المسارات التي تتطلب تسجيل الدخول
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { currentUser, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      setLocation("/auth");
    }
  }, [currentUser, isLoading, setLocation]);

  if (isLoading) {
    return <div className="flex h-[80vh] items-center justify-center">جاري التحميل...</div>;
  }

  if (!currentUser) {
    return null; // سيتم التوجيه عبر useEffect
  }

  return <Component />;
}

function App() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/profile">
          {() => <ProtectedRoute component={ProfilePage} />}
        </Route>
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

export default App;
