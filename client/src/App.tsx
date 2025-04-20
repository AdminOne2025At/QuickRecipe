import { Switch, Route } from "wouter";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import AuthPage from "@/pages/auth-page";
import ProfilePage from "@/pages/profile-page";
import GamificationPage from "@/pages/gamification-page";
import { ReactNode } from "react";
import { SimpleHeader } from "@/components/SimpleHeader";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

// هيكل الصفحة المشترك
function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SimpleHeader />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-right">
            &copy; 2025 Quick Recipe by Egyptco. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppLayout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/auth" component={AuthPage} />
            <Route path="/profile" component={ProfilePage} />
            <Route path="/cooking-journey" component={GamificationPage} />
            <Route component={NotFound} />
          </Switch>
        </AppLayout>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
