# Quick Recipe

تطبيق اكتشاف وصفات سريع وممتع يمكنك من البحث عن وصفات بناءً على المكونات المتوفرة لديك.

## رابط العرض التوضيحي

يمكنك مشاهدة نسخة تجريبية من التطبيق على:

🔗 [عرض Quick Recipe مباشرة على Replit](https://replit.com/@YOURUSERNAME/quick-recipe)

> **ملاحظة**: ملف README.md هذا هو صفحة وصف المستودع فقط وليس التطبيق نفسه. لتشغيل التطبيق، اتبع التعليمات أدناه.

## النشر على Netlify

لنشر التطبيق على Netlify، اتبع هذه الخطوات:

1. قم بإنشاء حساب على [Netlify](https://netlify.com/) إذا لم يكن لديك واحد بالفعل
2. انقر على زر "Add new site" ثم "Import an existing project"
3. اختر مزود Git الخاص بك (مثل GitHub) واختر مستودع المشروع
4. في قسم الإعدادات الأساسية:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. في قسم "Advanced build settings" أضف متغيرات البيئة التالية:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_APP_ID`
   - `DATABASE_URL` (إذا كنت تستخدم قاعدة بيانات)
   - `OPENAI_API_KEY` (اختياري)
   - `GEMINI_API_KEY` (اختياري)
6. انقر على "Deploy site"

### حل مشكلة Page Not Found على Netlify

إذا واجهت مشكلة "Page Not Found" عند تصفح التطبيق على Netlify، تأكد من:

1. وجود ملف `_redirects` في مجلد `client/public/` بالمحتوى التالي:
   ```
   /* /index.html 200
   ```

2. وجود ملف `netlify.toml` في المجلد الرئيسي بإعدادات التوجيه الصحيحة (موجود بالفعل في المشروع)

3. من لوحة تحكم Netlify، انتقل إلى:
   - Site settings > Build & deploy > Post processing > Asset optimization
   - قم بتمكين "Bundle CSS" و "Bundle JS"
   - قم بتمكين "Pretty URLs"

## الميزات الرئيسية

- 🥗 اقتراحات وصفات بناءً على المكونات المتوفرة
- 🔄 اقتراحات بدائل للمكونات غير المتوفرة
- 👨‍🍳 مشاركة الوصفات مع المجتمع
- 🕒 مؤقت طبخ تفاعلي
- 📱 واجهة متجاوبة مع جميع الأجهزة
- 🇪🇬 دعم للغة العربية المصرية
- 🎬 فيديوهات طبخ من YouTube
- 🔍 تصفية الوصفات حسب نوع المطبخ أو القيود الغذائية
- 💾 حفظ الوصفات المفضلة

## البدء باستخدام التطبيق

### المتطلبات المسبقة

- [Node.js](https://nodejs.org/) v18.0.0 أو أعلى
- قاعدة بيانات PostgreSQL (اختياري للتطوير المحلي، حيث يمكن استخدام التخزين في الذاكرة)

### الإعداد

1. استنساخ المستودع:

```bash
git clone https://github.com/YOURUSERNAME/quick-recipe.git
cd quick-recipe
```

2. تثبيت الاعتماديات:

```bash
npm install
```

3. إعداد المتغيرات البيئية:

تم تصميم هذا المشروع ليعمل مع ملفات سيكريت منفصلة داخل مجلد `config/secrets/`. 
يمكنك إما استخدام ملف `.env` التقليدي، أو نظام ملفات السيكريت (المفضل عند رفع المشروع إلى GitHub):

### الخيار الأول: استخدام ملفات السيكريت (الموصى به للتطوير المشترك)

1. انشئ المجلد `config/secrets/` إذا لم يكن موجودًا بالفعل
2. في هذا المجلد، أنشئ ملفات نصية لكل مفتاح API تحتاجه (انظر "الملفات المطلوبة" أدناه)
3. كل ملف يجب أن يتضمن قيمة المفتاح فقط، بدون اقتباسات أو أي محتوى إضافي

### الخيار الثاني: التحويل من ملف .env إلى ملفات السيكريت

إذا كان لديك ملف `.env` ترغب في تحويله إلى نظام ملفات السيكريت:

1. تأكد من وجود ملف `.env` في المجلد الجذر للمشروع
2. قم بتشغيل السكريبت التالي:
   ```bash
   node config/migrate-env-to-secrets.js
   ```
3. ستجد ملفات السيكريت التي تم إنشاؤها في مجلد `config/secrets/`

**ملفات السيكريت المطلوبة للتشغيل الأساسي:**

- `firebase_api_key.txt` - مفتاح Firebase API (مطلوب للمصادقة)
- `firebase_project_id.txt` - معرف مشروع Firebase (مطلوب للمصادقة)
- `firebase_app_id.txt` - معرف تطبيق Firebase (مطلوب للمصادقة)

**ملفات سيكريت اختيارية لميزات إضافية:**

- `openai_api_key.txt` - مفتاح OpenAI API (لتوليد الوصفات باستخدام ChatGPT)
- `gemini_api_key.txt` - مفتاح Gemini API (لتوليد الوصفات باستخدام Google Gemini)
- `deepseek_api_key.txt` - مفتاح Deepseek API (لتوليد الوصفات باستخدام Deepseek)
- `youtube_api_key.txt` - مفتاح YouTube API (للبحث عن فيديوهات الوصفات)
- `sendgrid_api_key.txt` - مفتاح SendGrid API (لإرسال رسائل البريد الإلكتروني)

**ملفات سيكريت لقاعدة البيانات:**

- `database_url.txt` - رابط قاعدة البيانات (إذا كنت تستخدم قاعدة بيانات خارجية)
- `pg_host.txt` - مضيف قاعدة البيانات
- `pg_port.txt` - منفذ قاعدة البيانات
- `pg_user.txt` - اسم مستخدم قاعدة البيانات
- `pg_password.txt` - كلمة مرور قاعدة البيانات
- `pg_database.txt` - اسم قاعدة البيانات

4. تشغيل التطبيق للتطوير:

```bash
npm run dev
```

5. بناء التطبيق للإنتاج:

```bash
npm run build
```

6. تشغيل التطبيق في وضع الإنتاج:

```bash
npm start
```

## إعداد الـ Firebase

1. قم بإنشاء مشروع Firebase جديد على [لوحة تحكم Firebase](https://console.firebase.google.com/).
2. قم بتفعيل مصادقة Google من قسم "Authentication".
3. أضف النطاق الخاص بموقعك (مثل `http://localhost:5000`) إلى قائمة "Authorized domains".
4. احصل على بيانات تكوين Firebase (apiKey, projectId, appId) واضفها إلى ملفات السيكريت المناسبة كما هو موضح أعلاه.

## التكنولوجيا المستخدمة

- **الواجهة الأمامية**: React, TypeScript, Tailwind CSS, Shadcn
- **الخادم**: Node.js, Express
- **قاعدة البيانات**: PostgreSQL مع Drizzle ORM
- **المصادقة**: Firebase Authentication
- **أدوات أخرى**: OpenAI/Google Gemini/Deepseek API، YouTube API، SendGrid

## المساهمة

نرحب بالمساهمات! يرجى اتباع هذه الخطوات:

1. Fork المستودع
2. إنشاء فرع ميزة جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'إضافة ميزة رائعة'`)
4. Push إلى الفرع (`git push origin feature/amazing-feature`)
5. فتح طلب Pull Request

## الترخيص

هذا المشروع مرخص تحت [رخصة MIT](LICENSE).# QuickRecipes
# QuickRecipes
