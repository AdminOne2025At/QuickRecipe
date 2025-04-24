# دليل نشر تطبيق كويك ريسب على Netlify

هذا الدليل سيساعدك في نشر تطبيق كويك ريسب على منصة Netlify بطريقة صحيحة، مع التأكد من أن الخادم الخلفي والواجهة الأمامية تعملان بشكل صحيح.

## متطلبات النشر

1. حساب على منصة Netlify (يمكنك التسجيل مجانًا من [هنا](https://app.netlify.com/signup))
2. مستودع git (GitHub, GitLab, أو Bitbucket) يحتوي على كود المشروع
3. قاعدة بيانات PostgreSQL خارجية (يمكن استخدام [Neon](https://neon.tech/) أو [Supabase](https://supabase.com/))

## الإعداد على Netlify

### الخطوة 1: ربط المشروع بـ Netlify

1. قم بتسجيل الدخول إلى حسابك على Netlify
2. اضغط على "Add New Site" > "Import an existing project"
3. اختر مزود مستودع Git (GitHub, GitLab, أو Bitbucket)
4. حدد المستودع الذي يحتوي على مشروع كويك ريسب
5. في صفحة إعدادات النشر، تأكد من:
   - قسم Build: `npm run build`
   - قسم Publish directory: `dist`
   - قسم Functions directory: `netlify/functions`

### الخطوة 2: إعداد المتغيرات البيئية

أضف المتغيرات البيئية التالية في إعدادات موقعك على Netlify (Site settings > Environment variables):

```
DATABASE_URL=postgresql://username:password@host:port/database
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_APP_ID=your-firebase-app-id
OPENAI_API_KEY=your-openai-api-key
GEMINI_API_KEY=your-gemini-api-key
SESSION_SECRET=some-strong-random-string
```

> **هام**: تأكد من استخدام نفس المتغيرات التي تستخدمها في بيئة التطوير المحلية.

### الخطوة 3: إعداد قاعدة البيانات

1. تأكد من أن قاعدة البيانات الخارجية تسمح بالاتصالات من Netlify (عادة يجب أن يكون الوصول عامًا)
2. قم بتطبيق مخطط قاعدة البيانات الخاص بالتطبيق على قاعدة البيانات الخارجية

### الخطوة 4: إعداد منطقة Firebase

1. افتح [وحدة تحكم Firebase](https://console.firebase.google.com/)
2. انتقل إلى مشروع كويك ريسب
3. في "Authentication" > "Sign-in method"، تأكد من تفعيل طرق تسجيل الدخول المطلوبة
4. في "Authentication" > "Settings" > "Authorized domains"، أضف عنوان URL الخاص بموقع Netlify الخاص بك

## حل المشكلات الشائعة

### صفحة "Page not found"

إذا ظهرت صفحة "Page not found" على موقع Netlify:

1. تأكد من أن ملف `netlify.toml` تم إعداده بشكل صحيح مع إعادة توجيه SPA:
   ```toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. تأكد من أن عملية البناء تمت بنجاح وأن الملفات موجودة في المجلد `dist`

### مشاكل الاتصال بقاعدة البيانات

1. تحقق من صحة عنوان URL لقاعدة البيانات
2. تأكد من أن قاعدة البيانات تسمح بالاتصال من عنوان IP لـ Netlify
3. راجع سجلات الدوال في Netlify للحصول على معلومات أكثر تفصيلاً حول الأخطاء

### مشاكل المصادقة مع Firebase

1. تأكد من إضافة عنوان URL الخاص بموقع Netlify إلى قائمة النطاقات المصرح بها في إعدادات Firebase
2. تحقق من أن مفاتيح الواجهة (`VITE_FIREBASE_*`) قد تم تعيينها بشكل صحيح

## تلميحات إضافية

1. استخدم **Netlify Identity** كبديل لنظام المصادقة الحالي إذا أردت الاستفادة من ميزات Netlify المدمجة
2. قم بتفعيل بيئة معاينة (Preview) للحصول على نشر تجريبي قبل نشر الإنتاج
3. استخدم دوال Netlify بشكل مناسب لسهولة تحديث المنطق في جانب الخادم

## تحديثات المشروع بعد النشر

بعد النشر الأولي، يمكنك تحديث موقعك ببساطة عن طريق:

1. دفع التغييرات إلى فرع المشروع المرتبط بـ Netlify (عادة `main` أو `master`)
2. سيقوم Netlify تلقائيًا بنشر النسخة الجديدة

## مصادر إضافية

- [وثائق Netlify Function](https://docs.netlify.com/functions/overview/)
- [وثائق دعم قواعد البيانات على Netlify](https://docs.netlify.com/functions/database-connections/)
- [إعداد Firebase مع Netlify](https://www.netlify.com/blog/2020/02/18/integrate-firebase-and-netlify-functions/)