import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  isArabic: boolean;
  setLanguage: (lang: Language) => void;
  getLocalizedText: (key: string, texts: Record<Language, string>) => string;
  toggleLanguage: () => void;
}

const defaultLanguage: Language = 'ar-EG';

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  isArabic: true,
  setLanguage: () => {},
  getLocalizedText: () => '',
  toggleLanguage: () => {},
});

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  // إذا كان السياق غير متاح (محتوى LanguageContext غير موجود)، أعد القيم الافتراضية
  if (!context) {
    console.warn('useLanguage must be used within a LanguageProvider');
    return {
      language: 'ar-EG' as Language,
      isArabic: true,
      setLanguage: () => {},
      getLocalizedText: () => '',
      toggleLanguage: () => {},
    };
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // محاولة الحصول على اللغة من التخزين المحلي أولاً
    const savedLanguage = localStorage.getItem('app-language');
    return (savedLanguage as Language) || defaultLanguage;
  });
  
  // حساب ما إذا كانت اللغة الحالية هي العربية
  const isArabic = language.startsWith('ar');
  
  // دالة لتبديل اللغة بين العربية والإنجليزية
  const toggleLanguage = () => {
    const newLanguage: Language = isArabic ? 'en-US' : 'ar-EG';
    console.log('Toggling language from', language, 'to', newLanguage);
    handleSetLanguage(newLanguage);
    
    // تحديث الصفحة بالكامل لضمان تطبيق جميع التغييرات
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };
  
  // وظيفة مساعدة لضبط اللغة وتحديث التخزين المحلي
  const handleSetLanguage = (lang: Language) => {
    console.log('Setting language to:', lang);
    setLanguage(lang);
    localStorage.setItem('app-language', lang);
  };

  useEffect(() => {
    // حفظ في التخزين المحلي عند تغيير اللغة
    localStorage.setItem('app-language', language);
    
    // تحديث اتجاه المستند
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // تطبيق التغييرات على body للتأكد من تطبيق الاتجاه الصحيح
    document.body.dir = isArabic ? 'rtl' : 'ltr';
    document.body.classList.toggle('rtl', isArabic);
    document.body.classList.toggle('ltr', !isArabic);
    
    console.log('Language changed to:', language, 'isArabic:', isArabic, 'direction:', document.documentElement.dir);
  }, [language, isArabic]);

  const getLocalizedText = (key: string, texts: Record<Language, string>) => {
    // تحقق من وجود النصوص وأن المفتاح موجود
    if (!texts) return key;
    
    try {
      // محاولة الحصول على النص باللغة الحالية
      if (language && texts[language]) {
        return texts[language];
      }
      
      // الرجوع إلى اللغة الافتراضية إذا لم تكن اللغة الحالية متاحة
      if (texts[defaultLanguage]) {
        return texts[defaultLanguage];
      }
      
      // الرجوع إلى أي لغة متاحة في حالة عدم وجود اللغة الافتراضية
      const anyAvailableLanguage = Object.keys(texts)[0] as Language;
      if (anyAvailableLanguage && texts[anyAvailableLanguage]) {
        return texts[anyAvailableLanguage];
      }
    } catch (error) {
      console.error('Error in getLocalizedText:', error);
    }
    
    // إذا لم يتم العثور على أي نص، أعد المفتاح نفسه
    return key;
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        isArabic, 
        setLanguage: handleSetLanguage, 
        getLocalizedText,
        toggleLanguage 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;