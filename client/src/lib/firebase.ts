import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider, 
  onAuthStateChanged,
  signOut,
  updateProfile,
  User,
  UserCredential
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import env, { logEnvStatus } from "./env-loader";

// تسجيل حالة المتغيرات البيئية
logEnvStatus();

// Firebase configuration
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY.trim(),
  authDomain: `${env.VITE_FIREBASE_PROJECT_ID.trim()}.firebaseapp.com`,
  projectId: env.VITE_FIREBASE_PROJECT_ID.trim(),
  storageBucket: `${env.VITE_FIREBASE_PROJECT_ID.trim()}.appspot.com`,
  appId: env.VITE_FIREBASE_APP_ID.trim(),
};

// تسجيل التكوين في وحدة التحكم للتصحيح (بدون الكشف عن المفاتيح الحساسة)
console.log("Firebase config (without sensitive keys):", { 
  projectId: env.VITE_FIREBASE_PROJECT_ID.trim(),
  authDomain: `${env.VITE_FIREBASE_PROJECT_ID.trim()}.firebaseapp.com`, 
  hasApiKey: !!env.VITE_FIREBASE_API_KEY,
  hasAppId: !!env.VITE_FIREBASE_APP_ID
});

// عرض رسالة توضيحية حول مشكلة تكوين Firebase
console.warn(`
يجب إضافة النطاق: "${window.location.origin}" 
إلى قائمة النطاقات المصرح بها في لوحة تحكم Firebase:
- Firebase console -> Authentication -> Settings -> Authorized domains tab

لحل مشكلات تسجيل الدخول، اتبع هذه الخطوات:
1. افتح لوحة تحكم Firebase: https://console.firebase.google.com/
2. اختر مشروعك: ${env.VITE_FIREBASE_PROJECT_ID}
3. اذهب إلى Authentication -> Settings -> Authorized domains
4. أضف النطاق: ${window.location.origin}
5. احفظ التغييرات وأعد تحميل التطبيق
`);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Sign in with Google - using both methods for better compatibility
export const signInWithGoogle = async (): Promise<void> => {
  try {
    // يضيف نطاق للوصول إلى قائمة الاسماء والصور الشخصية
    googleProvider.addScope('profile');
    googleProvider.addScope('email');
    
    // Force account selection every time to prevent automatic login 
    // and user confusion if multiple Google accounts exist
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });

    // للتبسيط، نستخدم دائمًا طريقة إعادة التوجيه التي تعمل بشكل أفضل عبر الأجهزة
    console.log("Using signInWithRedirect for authentication...");
    await signInWithRedirect(auth, googleProvider);
    
    // ملاحظة: signInWithRedirect يقوم بتنفيذ عملية إعادة توجيه مباشرة
    // لذلك لن يتم الوصول إلى الكود الذي بعده إلا بعد إعادة تحميل الصفحة
    
    // تم إضافة console.log للتشخيص، لكن لن يتم الوصول إليه إلا إذا فشلت عملية إعادة التوجيه
    console.log("If you see this, redirect failed but didn't throw an error");
  } catch (error) {
    console.error("Error initiating sign-in with Google:", error);
    throw error;
  }
};

// Handle redirect result
export const handleRedirectResult = async (): Promise<User | null> => {
  try {
    console.log("Attempting to get redirect result...");
    const result = await getRedirectResult(auth);
    
    if (result && result.user) {
      // تم تسجيل الدخول بنجاح مع Firebase
      console.log("Successfully got redirect result, user logged in with Firebase:", result.user.displayName);
      
      // الآن نقوم بالتكامل مع خادم Express لإنشاء جلسة المستخدم
      try {
        // إرسال بيانات مستخدم Firebase للخادم
        const response = await fetch('/api/firebase/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firebaseUid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
            // يمكن إضافة idToken للتحقق من الهوية في جانب الخادم
            idToken: await result.user.getIdToken()
          }),
          credentials: 'include' // مهم جداً لإرسال واستقبال الكوكيز
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("Successfully created server session for Firebase user:", data);
          
          // إعادة تحميل الصفحة للتأكد من تحديث حالة الجلسة
          window.location.href = '/';
          return result.user;
        } else {
          // لا يمكن إنشاء جلسة خلفية للمستخدم
          const errorData = await response.json();
          console.error("Error creating server session:", errorData);
          throw new Error("Could not create server session for Firebase user");
        }
      } catch (serverError) {
        console.error("Error syncing Firebase auth with server:", serverError);
        
        // في حالة فشل تزامن Firebase مع الخادم، يمكن استخدام بيانات Firebase
        // مباشرة ولكن هذا ليس الحل الأمثل
        console.warn("Falling back to Firebase-only authentication (not recommended)");
        
        // حفظ بيانات المستخدم في localStorage مؤقتًا
        const userData = {
          id: result.user.uid,
          displayName: result.user.displayName || 'مستخدم جوجل',
          email: result.user.email,
          photoURL: result.user.photoURL,
          isFirebaseOnly: true // علامة لتوضيح أنه مستخدم Firebase فقط
        };
        
        localStorage.setItem('firebase_user', JSON.stringify(userData));
        
        // محاولة تسجيل دخول كزائر كحل بديل
        try {
          const guestLoginResponse = await fetch('/api/guest/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
            credentials: 'include'
          });
          
          if (guestLoginResponse.ok) {
            console.log("Fallback to guest login successful");
            // إعادة تحميل الصفحة للتأكد من تحديث حالة الجلسة
            window.location.href = '/';
          }
        } catch (guestLoginError) {
          console.error("Fallback guest login also failed:", guestLoginError);
        }
      }
      
      return result.user;
    }
    
    console.log("No redirect result found (normal if not redirected from authentication)");
    return null;
  } catch (error: any) {
    console.error("Error handling redirect result:", error);
    
    // تحسين معالجة الأخطاء الشائعة
    if (error.code) {
      switch (error.code) {
        case 'auth/unauthorized-domain':
          console.error(`
            خطأ: النطاق غير مصرح به
            يجب عليك إضافة "${window.location.origin}" إلى 
            قائمة النطاقات المصرح بها في إعدادات Firebase.
          `);
          // في هذه الحالة، نقوم بمحاولة تسجيل الدخول كزائر من الخادم
          try {
            const guestResponse = await fetch('/api/guest/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({}),
              credentials: 'include'
            });
            
            if (guestResponse.ok) {
              console.log("Automatic guest login successful after Firebase auth failed");
              // إعادة تحميل الصفحة للتأكد من تحديث حالة الجلسة
              window.location.href = '/';
              return null;
            } else {
              console.error("Guest login failed after Firebase auth failed");
            }
          } catch (guestError) {
            console.error("Failed to perform automatic guest login:", guestError);
          }
          break;
          
        case 'auth/web-storage-unsupported':
          console.error("خطأ: متصفحك لا يدعم تخزين الويب المطلوب للمصادقة");
          break;
          
        case 'auth/cancelled-popup-request':
        case 'auth/popup-closed-by-user':
          console.log("تم إلغاء/إغلاق عملية تسجيل الدخول - هذا أمر طبيعي إذا قام المستخدم بإغلاق النافذة");
          return null; // لا نرغب في رمي خطأ هنا لأن هذا يمكن أن يحدث عندما يغلق المستخدم النافذة
          
        case 'auth/popup-blocked':
          console.error("تم حظر النافذة المنبثقة بواسطة المتصفح");
          break;
          
        default:
          console.error(`خطأ في المصادقة: ${error.code}`, error);
      }
    }
    
    // في حالة الأخطاء الشديدة، نحاول تسجيل الدخول كزائر
    try {
      const guestResponse = await fetch('/api/guest/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
        credentials: 'include'
      });
      
      if (guestResponse.ok) {
        console.log("Fallback to guest login successful after auth error");
        // إعادة تحميل الصفحة للتأكد من تحديث حالة الجلسة
        window.location.href = '/';
        return null;
      }
    } catch (finalError) {
      console.error("All authentication methods failed:", finalError);
    }
    
    return null;
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (displayName: string, photoURL?: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No user is logged in");
  }
  
  try {
    await updateProfile(user, {
      displayName,
      photoURL: photoURL || user.photoURL
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

// Upload profile picture
export const uploadProfilePicture = async (file: File): Promise<string> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No user is logged in");
  }
  
  try {
    const storageRef = ref(storage, `profile_pictures/${user.uid}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    await updateProfile(user, {
      photoURL: downloadURL
    });
    return downloadURL;
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw error;
  }
};

// Subscribe to auth state changes
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export { auth };