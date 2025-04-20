import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export function SimpleHeader() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link href="/">
          <span className="text-2xl font-bold text-orange-500 cursor-pointer">Fast Recipe</span>
        </Link>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => window.location.href = "/auth"}
          className="gap-2"
        >
          <LogIn className="h-4 w-4" />
          <span>تسجيل الدخول</span>
        </Button>
      </div>
    </header>
  );
}