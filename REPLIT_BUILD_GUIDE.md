# دليل بناء تطبيق كويك ريسب على منصة Replit

## مقدمة
ʕ •ᴥ• ʔ

هذا الدليل يشرح كيفية بناء تطبيق كويك ريسب للأندرويد باستخدام منصة Replit. يستخدم المشروع تقنية Capacitor لتحويل تطبيق الويب إلى تطبيق أندرويد مع إضافة ميزات مثل شعار الدب الجديد، شاشة البداية (Splash Screen) ووضع عدم الاتصال بالإنترنت.

## المتطلبات الأساسية

1. حساب على منصة Replit
2. تثبيت الإضافات اللازمة في تطبيقك (تم تثبيتها بالفعل)
   - @capacitor/core
   - @capacitor/android
   - @capacitor/cli

## خطوات البناء

### 1. تجهيز المشروع

تأكد من أن ملف `capacitor.config.ts` يشير إلى المجلد الصحيح لملفات الويب:

```typescript
const config: CapacitorConfig = {
  appId: 'com.egyptco.quickrecipe',
  appName: 'Quick Recipe',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    CapacitorCookies: {
      enabled: true
    }
  }
};
```

### 2. بناء المشروع

1. **بناء تطبيق الويب**

   ```bash
   npm run build
   ```

   هذا الأمر سيقوم ببناء تطبيق الويب وإنشاء مجلد `dist/public`.

2. **تهيئة منصة الأندرويد** (إذا لم تكن موجودة)

   ```bash
   npx cap add android
   ```

3. **نسخ الملفات المخصصة** إلى مجلد المشروع:

   ```bash
   # نسخ ملفات Java
   cp -f android_templates/src/main/java/com/egyptco/quickrecipe/*.java android/app/src/main/java/com/egyptco/quickrecipe/
   
   # نسخ ملفات الموارد
   cp -f android_templates/src/main/res/layout/* android/app/src/main/res/layout/
   cp -f android_templates/src/main/res/drawable/* android/app/src/main/res/drawable/
   cp -f android_templates/src/main/res/values/* android/app/src/main/res/values/
   
   # نسخ AndroidManifest.xml
   cp -f android_templates/src/main/AndroidManifest.xml android/app/src/main/AndroidManifest.xml
   ```

4. **مزامنة المشروع**

   ```bash
   npx cap sync android
   ```

   هذا الأمر سينسخ ملفات الويب إلى مشروع الأندرويد.

### 3. بناء ملف APK

1. **انتقل إلى مجلد الأندرويد**

   ```bash
   cd android
   ```

2. **قم ببناء ملف APK باستخدام Gradle**

   ```bash
   ./gradlew assembleDebug
   ```

   ستجد ملف APK في المسار التالي:
   
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

3. **نسخ APK إلى المجلد الرئيسي للمشروع** (اختياري)

   ```bash
   cp app/build/outputs/apk/debug/app-debug.apk ../QuickRecipe.apk
   ```

### 4. تبسيط العملية باستخدام السكريبت

يمكنك استخدام سكريبت `build-apk.sh` لتنفيذ جميع الخطوات السابقة تلقائيًا:

```bash
chmod +x build-apk.sh
./build-apk.sh
```

## ملاحظات هامة عند البناء على منصة Replit

1. **توفر الأدوات:** تأكد من توفر الأدوات اللازمة في مساحة العمل الخاصة بك مثل JDK وGradle.

2. **القيود الزمنية:** عملية البناء قد تستغرق وقتًا طويلاً، قد تحتاج إلى تشغيل بعض الخطوات يدويًا.

3. **المساحة التخزينية:** تأكد من وجود مساحة تخزين كافية في حسابك على Replit.

4. **الاتصال بالإنترنت:** تأكد من استقرار الاتصال بالإنترنت أثناء عملية البناء.

5. **الإعدادات المخصصة:** قمنا بإضافة ميزات مخصصة مثل:
   - شعار الدب الجديد (ʕ •ᴥ• ʔ) في كل واجهات التطبيق
   - شاشة البداية (Splash Screen) بشعار الدب
   - وضع عدم الاتصال بالإنترنت مع واجهة بصرية متناسقة
   - تطبيق QuickRecipeApplication لإدارة حالة التطبيق مع سجلات رمز الدب

## التحديات والحلول في منصة Replit

### تحدي بناء APK في Replit

منصة Replit لا توفر دعمًا كاملًا لبناء تطبيقات الأندرويد نظرًا لأنها تتطلب:
1. تثبيت JDK (Java Development Kit)
2. وجود أدوات Android SDK
3. وجود Gradle

### الحلول البديلة

1. **استخراج وتنزيل المشروع**
   - أكمل عملية التطوير وتكوين المشروع في Replit
   - قم بتنزيل المشروع كاملاً
   - قم بعملية البناء النهائي على جهاز محلي به JDK و Android SDK

2. **استخدام خدمات البناء السحابية**
   - استخدم GitHub Actions أو Bitrise أو CircleCI
   - قم بإعداد سير عمل (workflow) لبناء APK تلقائيًا

### استكشاف الأخطاء وإصلاحها

1. **خطأ "Android platform already exists":**
   - قمنا بتعديل السكريبت لتخطي خطوة إضافة منصة الأندرويد إذا كانت موجودة بالفعل.

2. **خطأ "JAVA_HOME is not set":**
   - هذا خطأ متوقع في Replit لأن Java غير مثبت افتراضيًا.
   - قمنا بتعديل السكريبت للتعرف على هذه المشكلة وتقديم خيارات بديلة.

3. **فشل بناء Gradle:**
   - تأكد من وجود إصدار JDK المناسب.
   - حاول تنظيف المشروع باستخدام `./gradlew clean`.

4. **مشاكل في نسخ الملفات:**
   - تأكد من وجود المجلدات المستهدفة قبل النسخ.
   - استخدم الأمر `mkdir -p` لإنشاء المجلدات إذا لم تكن موجودة.

## التثبيت على جهاز الأندرويد

بعد الانتهاء من بناء ملف APK، يمكنك تحميله على جهاز الأندرويد الخاص بك وتثبيته مباشرة.

1. قم بتنزيل ملف `QuickRecipe.apk` من مساحة عمل Replit.

2. انقل الملف إلى جهاز الأندرويد الخاص بك.

3. قم بتثبيت التطبيق بالنقر على ملف APK (تأكد من تفعيل "تثبيت من مصادر غير معروفة" في إعدادات جهازك).