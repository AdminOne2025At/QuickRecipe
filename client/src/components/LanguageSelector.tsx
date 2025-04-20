import React, { useState, useEffect } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export type Language = 'ar-EG' | 'ar-SA' | 'en-US';

interface LanguageSelectorProps {
  onLanguageChange: (language: Language) => void;
  currentLanguage: Language;
}

const languages = [
  { 
    id: 'ar-EG', 
    name: 'العربية المصرية', 
    flag: '🇪🇬', 
    direction: 'rtl',
    indicator: 'يا سلام'
  },
  { 
    id: 'ar-SA', 
    name: 'العربية السعودية', 
    flag: '🇸🇦', 
    direction: 'rtl',
    indicator: 'يا حبيبي'
  },
  { 
    id: 'en-US', 
    name: 'English (US)', 
    flag: '🇺🇸', 
    direction: 'ltr',
    indicator: 'Cool!'
  }
];

export function LanguageSelector({ onLanguageChange, currentLanguage }: LanguageSelectorProps) {
  const getCurrentLanguageInfo = () => {
    return languages.find(lang => lang.id === currentLanguage) || languages[0];
  };

  const handleLanguageChange = (language: Language) => {
    onLanguageChange(language);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 hover:bg-primary/10 transition-colors font-medium"
        >
          <span className="text-xl">{getCurrentLanguageInfo().flag}</span>
          <span>{getCurrentLanguageInfo().name}</span>
          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{getCurrentLanguageInfo().indicator}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.id}
            className={`flex items-center gap-2 cursor-pointer ${
              currentLanguage === language.id ? 'bg-primary/10' : ''
            }`}
            onClick={() => handleLanguageChange(language.id as Language)}
          >
            <span className="text-lg">{language.flag}</span>
            <span>{language.name}</span>
            {currentLanguage === language.id && (
              <Check className="ml-auto h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSelector;