import { Capacitor } from '@capacitor/core';

/**
 * التحقق مما إذا كان التطبيق يعمل على الأندرويد 
 * (أي ليس في المتصفح)
 */
export function isNativePlatform(): boolean {
  return Capacitor.isNativePlatform();
}

/**
 * التحقق مما إذا كان الجهاز يستخدم نظام أندرويد
 */
export function isAndroid(): boolean {
  return Capacitor.getPlatform() === 'android';
}

/**
 * التحقق مما إذا كان التطبيق يعمل على الويب
 */
export function isWeb(): boolean {
  return Capacitor.getPlatform() === 'web';
}

/**
 * الحصول على معلومات الجهاز مثل النظام والإصدار والموديل
 */
export async function getDeviceInfo() {
  if (!isNativePlatform()) {
    return {
      platform: 'web',
      model: navigator.userAgent,
      operatingSystem: navigator.platform,
      osVersion: navigator.userAgent,
      webViewVersion: navigator.userAgent
    };
  }

  try {
    // استيراد دينامي لتجنب أخطاء التحميل على الويب
    const { Device } = await import('@capacitor/device');
    return await Device.getInfo();
  } catch (error) {
    console.error('خطأ في الحصول على معلومات الجهاز:', error);
    return null;
  }
}

/**
 * تسجيل الخروج من حساب المستخدم على الأجهزة المحمولة
 * باستخدام واجهة البرمجة المناسبة للمنصة
 */
export async function logoutFromDevice() {
  try {
    // هنا يمكن إضافة منطق خاص بالمنصة للتعامل مع تسجيل الخروج
    if (isNativePlatform()) {
      // على سبيل المثال، مسح التخزين المحلي أو إنهاء جلسة محددة
      localStorage.clear();
      sessionStorage.clear();
      // إعادة توجيه إلى صفحة تسجيل الدخول
      window.location.href = '/auth';
    } else {
      // تسجيل الخروج من واجهة الويب
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        window.location.href = '/auth';
      }
    }
  } catch (error) {
    console.error('خطأ أثناء تسجيل الخروج:', error);
    return false;
  }
}