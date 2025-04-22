# دليل بناء تطبيق كويك ريسب للأندرويد

## المتطلبات

قبل بدء عملية البناء، تأكد من وجود المتطلبات التالية:

1. **Node.js:** الإصدار 16 أو أحدث
2. **npm:** أحدث إصدار
3. **JDK (Java Development Kit):** الإصدار 11 أو أحدث
4. **Android Studio:** أحدث إصدار
5. **متغيرات البيئة الخاصة بالأندرويد:**
   - `ANDROID_HOME` يشير إلى مسار SDK الخاص بالأندرويد
   - `JAVA_HOME` يشير إلى مسار JDK

## خطوات بناء التطبيق

### الطريقة السهلة (باستخدام السكريبت التلقائي)

1. تأكد من أن السكريبت `build-apk.sh` لديه صلاحيات التنفيذ:
   ```bash
   chmod +x build-apk.sh
   ```

2. قم بتشغيل السكريبت:
   ```bash
   ./build-apk.sh
   ```

3. انتظر حتى تكتمل العملية. سيتم إنشاء ملف `QuickRecipe.apk` في المجلد الرئيسي للمشروع.

### الطريقة اليدوية (خطوة بخطوة)

إذا واجهت مشاكل مع السكريبت التلقائي، يمكنك اتباع هذه الخطوات اليدوية:

#### 1. بناء تطبيق الويب

```bash
# تثبيت التبعيات
npm install

# بناء النسخة النهائية
npm run build
```

#### 2. إعداد Capacitor

```bash
# تثبيت Capacitor CLI
npm install @capacitor/cli

# إضافة منصة Android
npx cap add android
```

#### 3. نسخ الملفات المخصصة

```bash
# إنشاء المجلدات اللازمة
mkdir -p android/app/src/main/java/com/egyptco/quickrecipe
mkdir -p android/app/src/main/res/drawable
mkdir -p android/app/src/main/res/layout
mkdir -p android/app/src/main/res/values

# نسخ ملفات Java
cp android_templates/src/main/java/com/egyptco/quickrecipe/*.java android/app/src/main/java/com/egyptco/quickrecipe/

# نسخ ملفات الموارد
cp android_templates/src/main/res/drawable/* android/app/src/main/res/drawable/
cp android_templates/src/main/res/layout/* android/app/src/main/res/layout/
cp android_templates/src/main/res/values/* android/app/src/main/res/values/

# نسخ AndroidManifest.xml
cp android_templates/src/main/AndroidManifest.xml android/app/src/main/AndroidManifest.xml
```

#### 4. مزامنة المشروع

```bash
npx cap sync android
```

#### 5. بناء APK

```bash
cd android
./gradlew assembleDebug
cd ..
```

ستجد ملف APK في المسار:
`android/app/build/outputs/apk/debug/app-debug.apk`

يمكنك نسخه إلى المجلد الرئيسي:
```bash
cp android/app/build/outputs/apk/debug/app-debug.apk ./QuickRecipe.apk
```

## تثبيت التطبيق

1. انقل ملف APK إلى هاتف أندرويد.
2. قم بتثبيت التطبيق من خلال النقر على ملف APK.
3. قبل التثبيت، تأكد من تمكين "المصادر غير المعروفة" في إعدادات الأمان بجهازك.

## ميزات التطبيق المُحوّل

- **واجهة مستخدم مشابهة:** التطبيق يحافظ على نفس مظهر وسلوك نسخة الويب.
- **شعار الدب الجديد:** تم استبدال شعار الشوكة برمز الدب (ʕ •ᴥ• ʔ) في جميع أنحاء التطبيق.
- **دعم وضع عدم الاتصال:** يعرض رسالة مناسبة مع رمز الدب عندما يكون الجهاز غير متصل بالإنترنت.
- **شاشة بداية:** تعرض شعار الدب وكويك ريسب عند بدء التشغيل.
- **دعم اللغة العربية:** واجهة المستخدم موجهة من اليمين إلى اليسار (RTL) لدعم اللغة العربية.
- **تجربة مستخدم أصلية:** يعمل التطبيق بشكل مشابه للتطبيقات الأصلية مع دعم لزر العودة للخلف وتحسينات أخرى.

## استكشاف الأخطاء وإصلاحها

### الخطأ: لم يتم العثور على JDK

تأكد من تثبيت JDK وتعيين متغير البيئة `JAVA_HOME` بشكل صحيح.

```bash
# للتحقق من تثبيت JDK
java -version

# للتحقق من JAVA_HOME
echo $JAVA_HOME
```

### الخطأ: لم يتم العثور على Android SDK

تأكد من تثبيت Android Studio وتعيين متغير البيئة `ANDROID_HOME` بشكل صحيح.

```bash
# للتحقق من ANDROID_HOME
echo $ANDROID_HOME
```

### الخطأ: فشل في بناء APK

تأكد من وجود جميع ملفات التكوين اللازمة، خاصة `capacitor.config.ts`.

```bash
# تصحيح إذن التنفيذ لـ gradlew
chmod +x android/gradlew
```

## خطوات إضافية (اختيارية)

### 1. إنشاء APK موقّع للإنتاج

```bash
cd android
./gradlew assembleRelease
cd ..
```

### 2. تعديل إعدادات Capacitor

افتح ملف `capacitor.config.ts` وعدل الإعدادات حسب الحاجة، مثل اسم التطبيق أو معرف الحزمة.

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.egyptco.quickrecipe',
  appName: 'كويك ريسب',
  webDir: 'dist',
  bundledWebRuntime: false
};

export default config;
```

## للمساعدة

إذا واجهت أي مشاكل أثناء عملية البناء، يرجى مراجعة:

- [توثيق Capacitor الرسمي](https://capacitorjs.com/docs)
- [دليل Android Studio](https://developer.android.com/studio/intro)