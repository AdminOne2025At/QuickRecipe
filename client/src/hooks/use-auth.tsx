import { useContext, createContext, ReactNode, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AuthUser {
  id: number;
  username: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  firebaseUid?: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  firebaseUser: FirebaseUser | null;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log("Auth context initializing...");
    
    // Check if user is already set in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("User loaded from localStorage:", parsedUser);
        
        // تصحيح معرّف المشرف 9999 أو 5 إلى 1 (إذا كان هذا مشرف)
        if (parsedUser.isAdmin === true || parsedUser.id === 1 || parsedUser.id === 9999 || parsedUser.id === 5) {
          console.log("Admin user detected - setting admin privileges and converting ID to 1");
          parsedUser.id = 1;
          parsedUser.isAdmin = true;
          
          // تحديث localStorage للمستقبل
          localStorage.setItem("user", JSON.stringify({
            ...parsedUser,
            id: 1,
            isAdmin: true
          }));
        }
        
        // تحقق من وجود حقل isAdmin وضبطه إلى true/false إذا كان موجوداً
        const finalUser = {
          ...parsedUser,
          // نضمن أن id = 1 هو المشرف دائماً
          isAdmin: parsedUser.id === 1 || parsedUser.isAdmin === true
        };
        
        console.log("Setting user with finalized data:", finalUser);
        setUser(finalUser);
        
        // إذا كان المستخدم هو مشرف، نظهر رسالة ترحيب خاصة
        if (finalUser.isAdmin) {
          console.log("Admin user detected!");
          toast({
            title: "مرحباً بالمشرف",
            description: "لديك صلاحيات الإشراف على منصة كويك ريسب",
            variant: "default",
          });
        }
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
        localStorage.removeItem("user");
      }
    } else {
      console.log("No user found in localStorage");
    }

    // Listen for Firebase auth state changes
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        setFirebaseUser(firebaseUser);
        
        if (firebaseUser) {
          try {
            // Use Firebase user to authenticate with our backend
            const idToken = await firebaseUser.getIdToken();
            
            // In a real app, send the token to the backend and verify it there
            // For this demo, we'll just create a user record with Firebase data
            try {
              // أولاً، نحاول تسجيل مستخدم جديد
              const registerResponse = await apiRequest("POST", "/api/users/register", {
                username: firebaseUser.displayName || firebaseUser.email || `user_${firebaseUser.uid.substring(0, 8)}`,
                password: `firebase_${firebaseUser.uid}`, 
                confirmPassword: `firebase_${firebaseUser.uid}`,
                email: firebaseUser.email,
                firebaseUid: firebaseUser.uid,
                photoURL: firebaseUser.photoURL
              });
              
              let userData;
              
              if (registerResponse.ok) {
                // نجح التسجيل
                userData = await registerResponse.json();
              } else {
                // إذا فشل التسجيل لأن المستخدم موجود بالفعل
                const errorData = await registerResponse.json();
                
                if (errorData.message === "Username already exists") {
                  // نحاول تسجيل الدخول
                  const loginResponse = await apiRequest("POST", "/api/login", {
                    username: firebaseUser.displayName || firebaseUser.email || `user_${firebaseUser.uid.substring(0, 8)}`,
                    password: `firebase_${firebaseUser.uid}`
                  });
                  
                  if (loginResponse.ok) {
                    userData = await loginResponse.json();
                  } else {
                    throw new Error("Failed to login with existing Firebase account");
                  }
                } else {
                  throw new Error("Failed to register with Firebase account: " + errorData.message);
                }
              }
              
              // حفظ بيانات المستخدم
              setUser({
                ...userData,
                displayName: firebaseUser.displayName || undefined,
                photoURL: firebaseUser.photoURL || undefined,
                email: firebaseUser.email || undefined
              });
              
              const userWithDetails = {
                ...userData,
                displayName: firebaseUser.displayName || undefined,
                photoURL: firebaseUser.photoURL || undefined,
                email: firebaseUser.email || undefined
              };
              
              localStorage.setItem("user", JSON.stringify(userWithDetails));
              
              // إرسال إشعار تسجيل دخول بجوجل للديسكورد (بدون انتظار النتيجة)
              try {
                fetch('/api/login/notify', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    username: userWithDetails.username,
                    loginMethod: 'google',
                    userAgent: navigator.userAgent,
                    email: userWithDetails.email
                  }),
                }).catch(err => console.error("فشل إرسال إشعار تسجيل الدخول بجوجل:", err));
              } catch (notifyError) {
                console.error("خطأ عند إعداد إشعار تسجيل الدخول بجوجل:", notifyError);
              }
            } catch (err) {
              console.error("Authentication error:", err);
              throw err;
            }
          } catch (err) {
            console.error("Error authenticating with backend:", err);
            setError(err instanceof Error ? err : new Error(String(err)));
            toast({
              title: "خطأ في تسجيل الدخول",
              description: "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.",
              variant: "destructive",
            });
          }
        }
        
        setIsLoading(false);
      },
      (err) => {
        console.error("Firebase auth error:", err);
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [toast]);

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}