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

    // نجرب طريقة النافذة المنبثقة أولاً على الأجهزة المكتبية
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      console.log("Using redirect method for mobile device");
      await signInWithRedirect(auth, googleProvider);
    } else {
      console.log("Using popup method for desktop device");
      try {
        await signInWithPopup(auth, googleProvider);
      } catch (popupError) {
        console.log("Popup failed, falling back to redirect:", popupError);
        await signInWithRedirect(auth, googleProvider);
      }
    }
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
    if (result) {
      // تم تسجيل الدخول بنجاح
      console.log("Successfully got redirect result, user logged in:", result.user.displayName);
      return result.user;
    }
    console.log("No redirect result found (normal if not redirected from authentication)");
    return null;
  } catch (error: any) {
    console.error("Error handling redirect result:", error);
    
    // رسائل خطأ أكثر تفصيلاً استناداً إلى نوع الخطأ
    if (error.code) {
      switch (error.code) {
        case 'auth/unauthorized-domain':
          console.error(`
            خطأ: النطاق غير مصرح به
            يجب عليك إضافة "${window.location.origin}" إلى 
            قائمة النطاقات المصرح بها في إعدادات Firebase.
          `);
          break;
        case 'auth/web-storage-unsupported':
          console.error("خطأ: متصفحك لا يدعم تخزين الويب المطلوب للمصادقة");
          break;
        case 'auth/cancelled-popup-request':
          console.log("تم إلغاء طلب النافذة المنبثقة - هذا عادي إذا قام المستخدم بإغلاق النافذة");
          return null; // لا نرغب في رمي خطأ هنا لأن هذا يمكن أن يحدث عندما يغلق المستخدم النافذة المنبثقة
        case 'auth/popup-blocked':
          console.error("تم حظر النافذة المنبثقة بواسطة المتصفح");
          break;
        default:
          console.error(`خطأ في المصادقة: ${error.code}`, error);
      }
    }
    
    throw error;
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