import { useContext, createContext, ReactNode, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";

interface AuthUser {
  id: number;
  username: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  firebaseUid?: string;
  isAdmin?: boolean;
  isGuest?: boolean;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  email?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  firebaseUser: FirebaseUser | null;
  error: Error | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  adminLogin: (credentials: LoginCredentials) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch session user data
  const { data: sessionUser, isLoading: isSessionLoading } = useQuery({
    queryKey: ['/api/user'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/user');
        if (!response.ok) {
          if (response.status === 401) {
            console.log('User not authenticated');
            return null;
          }
          throw new Error('Failed to fetch user data');
        }
        return await response.json();
      } catch (error) {
        console.error('Error fetching user session:', error);
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Set user from session
  useEffect(() => {
    if (!isSessionLoading) {
      if (sessionUser) {
        console.log('User authenticated from session:', sessionUser);
        setUser(sessionUser);
        // لا حاجة لتخزين بيانات المستخدم في التخزين المحلي
        // فقط نعتمد على جلسة الخادم
      } else {
        console.log('No authenticated session found');
        // نقوم بإزالة بيانات التخزين المحلي أيضًا للتأكد من التطابق
        localStorage.removeItem('user');
        setUser(null);
      }
      setIsLoading(false);
    }
  }, [sessionUser, isSessionLoading]);

  // Firebase auth state listener
  useEffect(() => {
    console.log("Setting up Firebase auth listener...");
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(
      auth,
      async (fbUser) => {
        setFirebaseUser(fbUser);
        if (fbUser && !user) {
          console.log("Firebase auth detected, attempting to link with server session...");
          try {
            const idToken = await fbUser.getIdToken();
            
            // Call our server to create/verify the Firebase user
            // This is a placeholder - implement your Firebase session endpoint
            // In reality, we should implement this on server and client
            toast({
              title: "تسجيل الدخول بجوجل",
              description: "جاري ربط حساب جوجل بحسابك...",
              variant: "default",
            });
          } catch (err) {
            console.error("Firebase auth processing error:", err);
          }
        }
      },
      (err) => {
        console.error("Firebase auth error:", err);
      }
    );

    return () => unsubscribe();
  }, [toast, user]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await apiRequest("POST", "/api/login", credentials);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "فشل تسجيل الدخول");
      }
      return response.json();
    },
    onSuccess: (userData) => {
      console.log("Login successful:", userData);
      setUser(userData);
      // لا نستخدم التخزين المحلي للمعلومات الحساسة
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      
      // إرسال إشعار تسجيل دخول
      try {
        fetch('/api/login/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: userData.username,
            loginMethod: 'admin',
            userAgent: navigator.userAgent,
            email: userData.email,
            isAdmin: userData.isAdmin
          }),
        }).catch(err => console.error("فشل إرسال إشعار تسجيل الدخول:", err));
      } catch (notifyError) {
        console.error("خطأ في إشعار تسجيل الدخول:", notifyError);
      }
      
      toast({
        title: "تم تسجيل الدخول",
        description: `مرحباً بك ${userData.username}!`,
        variant: "default",
      });
    },
    onError: (error: Error) => {
      console.error("Login error:", error);
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Admin login mutation
  const adminLoginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await apiRequest("POST", "/api/admin/login", credentials);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "فشل تسجيل دخول المشرف");
      }
      return response.json();
    },
    onSuccess: (userData) => {
      console.log("Admin login successful:", userData);
      setUser(userData);
      // لا نستخدم التخزين المحلي للمعلومات الحساسة
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      
      // إرسال إشعار تسجيل دخول المشرف
      try {
        fetch('/api/login/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: userData.username,
            loginMethod: 'admin',
            userAgent: navigator.userAgent,
            email: userData.email,
            isAdmin: true
          }),
        }).catch(err => console.error("فشل إرسال إشعار تسجيل الدخول للمشرف:", err));
      } catch (notifyError) {
        console.error("خطأ في إشعار تسجيل دخول المشرف:", notifyError);
      }
      
      toast({
        title: "تم تسجيل دخول المشرف",
        description: "مرحباً بك في لوحة التحكم",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      console.error("Admin login error:", error);
      toast({
        title: "خطأ في تسجيل دخول المشرف",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Guest login mutation
  const guestLoginMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/guest/login", {});
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "فشل تسجيل دخول الزائر");
      }
      return response.json();
    },
    onSuccess: (userData) => {
      console.log("Guest login successful:", userData);
      setUser(userData);
      // لا نستخدم التخزين المحلي للمعلومات الحساسة
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      
      // إرسال إشعار تسجيل دخول الزائر
      try {
        fetch('/api/login/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: userData.username,
            loginMethod: 'guest',
            userAgent: navigator.userAgent,
            isGuest: true
          }),
        }).catch(err => console.error("فشل إرسال إشعار تسجيل دخول الزائر:", err));
      } catch (notifyError) {
        console.error("خطأ في إشعار تسجيل دخول الزائر:", notifyError);
      }
      
      toast({
        title: "تم تسجيل الدخول كزائر",
        description: "يمكنك الاستمتاع بالخدمات الأساسية",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      console.error("Guest login error:", error);
      toast({
        title: "خطأ في تسجيل دخول الزائر",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const response = await apiRequest("POST", "/api/register", credentials);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "فشل إنشاء الحساب");
      }
      return response.json();
    },
    onSuccess: (userData) => {
      console.log("Registration successful:", userData);
      setUser(userData);
      // لا نستخدم التخزين المحلي للمعلومات الحساسة
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      
      toast({
        title: "تم إنشاء الحساب",
        description: `مرحباً بك ${userData.username}!`,
        variant: "default",
      });
    },
    onError: (error: Error) => {
      console.error("Registration error:", error);
      toast({
        title: "خطأ في إنشاء الحساب",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      // Send logout notification before actual logout
      if (user) {
        try {
          await fetch('/api/login/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: user.username,
              loginMethod: user.isGuest ? 'guest' : (user.isAdmin ? 'admin' : 'standard'),
              userAgent: navigator.userAgent,
              email: user.email,
              isAdmin: user.isAdmin,
              isLogout: true
            }),
          });
        } catch (notifyError) {
          console.error("خطأ في إشعار تسجيل الخروج:", notifyError);
        }
      }
      
      // Perform actual logout
      const response = await apiRequest("POST", "/api/logout", {});
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "فشل تسجيل الخروج");
      }
      return response.json();
    },
    onSuccess: () => {
      // تنظيف التخزين المحلي إذا كان موجوداً
      localStorage.removeItem("user");
      setUser(null);
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      
      toast({
        title: "تم تسجيل الخروج",
        description: "شكراً لزيارتك موقعنا",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      console.error("Logout error:", error);
      toast({
        title: "خطأ في تسجيل الخروج",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Public methods
  const login = async (credentials: LoginCredentials) => {
    await loginMutation.mutateAsync(credentials);
  };

  const loginAsGuest = async () => {
    await guestLoginMutation.mutateAsync();
  };

  const register = async (credentials: RegisterCredentials) => {
    await registerMutation.mutateAsync(credentials);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const adminLogin = async (credentials: LoginCredentials) => {
    await adminLoginMutation.mutateAsync(credentials);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isLoading: isLoading || isSessionLoading,
        error,
        login,
        loginAsGuest,
        register,
        logout,
        adminLogin,
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