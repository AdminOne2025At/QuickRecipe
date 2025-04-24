// تكوين تطبيق كويك ريسب
// يستخدم للإعدادات المختلفة بين بيئات التطوير والإنتاج

// تحديد ما إذا كان التطبيق يعمل على Netlify من خلال التحقق من URL
const isNetlify = window.location.hostname.includes('netlify.app') || 
                 window.location.hostname.includes('netlify.com');

// تكوين نقطة نهاية API بناءً على البيئة
export const API_BASE_URL = isNetlify ? '/api' : '/api';

// إعدادات Firebase
export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// إعدادات تسجيل الدخول
export const AUTH_CONFIG = {
  // استخدم مزود مختلف للمصادقة في بيئة Netlify إذا لزم الأمر
  provider: isNetlify ? 'local' : 'firebase',
  
  // وقت انتهاء صلاحية الجلسة بالمللي ثانية (ساعة واحدة)
  sessionTimeout: 60 * 60 * 1000
};

// إعدادات اللغات المدعومة
export const SUPPORTED_LANGUAGES = ['ar', 'en'];
export const DEFAULT_LANGUAGE = 'ar';

// إعدادات الواجهة
export const UI_CONFIG = {
  maxRecentRecipes: 8,
  maxRecentPosts: 10,
  maxTrendingPosts: 4
};

export default {
  API_BASE_URL,
  FIREBASE_CONFIG,
  AUTH_CONFIG,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  UI_CONFIG
};