import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { 
  auth, 
  signInWithGoogle, 
  signOutUser, 
  updateUserProfile, 
  uploadProfilePicture,
  subscribeToAuthChanges 
} from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (displayName: string, photoURL?: string) => Promise<void>;
  uploadPicture: (file: File) => Promise<string>;
  userPreferences: UserPreferences;
  updateUserPreferences: (preferences: UserPreferences) => void;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  favoriteCuisine: string;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  notificationsEnabled: true,
  favoriteCuisine: 'عربية'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(defaultPreferences);
  const { toast } = useToast();
  
  // استخدام wouter للتنقل والتوجيه
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      // اذا كان المستخدم مسجل دخول حديثًا، سنقوم بتوجيهه للصفحة الرئيسية
      const isNewLogin = user && !currentUser;
      
      setCurrentUser(user);
      setIsLoading(false);
      
      // Load user preferences from localStorage if the user is logged in
      if (user) {
        console.log('User authenticated:', user.displayName);
        const savedPreferences = localStorage.getItem(`userPrefs_${user.uid}`);
        if (savedPreferences) {
          setUserPreferences(JSON.parse(savedPreferences));
        }
        
        // إذا كان تسجيل دخول جديد، قم بتوجيه المستخدم للصفحة الرئيسية
        if (isNewLogin && location !== '/') {
          console.log('Redirecting new login to home page from AuthContext');
          setLocation('/');
        }
      }
    });

    return unsubscribe;
  }, [currentUser, location, setLocation]);

  // Save preferences to localStorage when they change
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`userPrefs_${currentUser.uid}`, JSON.stringify(userPreferences));
    }
  }, [userPreferences, currentUser]);

  const signIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحبًا بك في تطبيق Fast Recipe",
      });
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "فشل تسجيل الدخول",
        description: "حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await signOutUser();
      toast({
        title: "تم تسجيل الخروج",
        description: "تم تسجيل خروجك بنجاح",
      });
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تسجيل الخروج",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (displayName: string, photoURL?: string) => {
    try {
      setIsLoading(true);
      await updateUserProfile(displayName, photoURL);
      toast({
        title: "تم التحديث",
        description: "تم تحديث الملف الشخصي بنجاح",
      });
    } catch (error) {
      console.error("Update profile error:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث الملف الشخصي",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const uploadPicture = async (file: File) => {
    try {
      setIsLoading(true);
      const downloadURL = await uploadProfilePicture(file);
      toast({
        title: "تم الرفع",
        description: "تم رفع الصورة بنجاح",
      });
      return downloadURL;
    } catch (error) {
      console.error("Upload picture error:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء رفع الصورة",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserPreferences = (preferences: UserPreferences) => {
    setUserPreferences(preferences);
    toast({
      title: "تم الحفظ",
      description: "تم حفظ التفضيلات بنجاح",
    });
  };

  const value = {
    currentUser,
    isLoading,
    signIn,
    signOut,
    updateProfile,
    uploadPicture,
    userPreferences,
    updateUserPreferences,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}