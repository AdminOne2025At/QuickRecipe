import React from 'react';
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageToggleButton({ className = "" }: { className?: string }) {
  const { isArabic, toggleLanguage } = useLanguage();
  
  return (
    <Button
      variant="outline"
      size="sm"
      className={`flex items-center gap-2 transition-all duration-300 ${className}`}
      onClick={toggleLanguage}
      title={isArabic ? "Switch to English" : "التبديل إلى العربية"}
    >
      <Globe className="h-4 w-4" />
      <span>{isArabic ? "English" : "العربية"}</span>
    </Button>
  );
}