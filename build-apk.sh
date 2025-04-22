#!/bin/bash
# سكريبت بناء تطبيق Android APK من موقع كويك ريسب

# تأكد من تثبيت متطلبات Android SDK
echo "قبل البدء، تأكد من تثبيت Android Studio SDK على جهازك"
echo "يمكنك تحميل Android Studio من: https://developer.android.com/studio"
echo ""

# 1. تهيئة المشروع في Capacitor
echo "جاري تهيئة مشروع Capacitor..."
npx cap init "كويك ريسب" "com.egyptco.quickrecipe"

# 2. بناء تطبيق الويب
echo "جاري بناء تطبيق الويب..."
npm run build

# 3. إضافة منصة Android
echo "جاري إضافة منصة Android..."
npx cap add android

# 4. نسخ ملفات البناء
echo "جاري نسخ ملفات البناء إلى مشروع Android..."
npx cap sync android

# 5. فتح مشروع Android Studio
echo "جاري فتح مشروع Android Studio..."
echo "** ملاحظة: لبناء ملف APK، افتح Android Studio واختر Build > Build Bundle(s) / APK(s) > Build APK(s)"
npx cap open android

echo ""
echo "تم الانتهاء من عملية الإعداد!"
echo "يمكنك الآن بناء ملف APK من خلال Android Studio."
echo "** بعد تشغيل ملف APK على جهازك، يمكنك الوصول إلى التطبيق حتى بدون اتصال بالإنترنت!"