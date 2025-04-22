#!/bin/bash

# هذا السكريبت يستخدم لبناء تطبيق أندرويد من موقع كويك ريسب
echo "بدء عملية تحويل موقع كويك ريسب إلى تطبيق أندرويد..."

# تهيئة مشروع Capacitor
echo "1. تهيئة مشروع Capacitor..."
npx cap init "كويك ريسب" "com.egyptco.quickrecipe"

# بناء تطبيق الويب
echo "2. بناء تطبيق الويب..."
npm run build

# إضافة منصة الأندرويد
echo "3. إضافة منصة الأندرويد..."
npx cap add android

# مزامنة ملفات المشروع مع مشروع الأندرويد
echo "4. مزامنة المشروع مع الأندرويد..."
npx cap sync android

echo "5. اكتمال العملية. الآن يمكنك فتح مشروع الأندرويد باستخدام الأمر:"
echo "   npx cap open android"
echo ""
echo "6. في Android Studio، اضغط على القائمة 'Build' ثم 'Build Bundle(s) / APK(s)' ثم 'Build APK(s)'"
echo "   سيتم إنشاء ملف APK في المجلد:"
echo "   android/app/build/outputs/apk/debug/app-debug.apk"