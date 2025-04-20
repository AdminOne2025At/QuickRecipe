# ملفات السيكرتس (Secret Files)

هذا المجلد يحتوي على ملفات السيكرتس (المفاتيح السرية) التي يستخدمها التطبيق.

## كيفية الاستخدام

1. قم بإنشاء ملف نصي لكل مفتاح API أو سر تريد استخدامه
2. اسم الملف يجب أن يتوافق مع الاسم المستخدم في ملف `config/index.js`
3. أضف محتوى المفتاح أو السر داخل الملف، بدون أقواس أو علامات تنصيص

## الملفات المطلوبة

قائمة بالملفات التي يمكن إضافتها:

- `database_url.txt` - رابط قاعدة البيانات
- `session_secret.txt` - سر الجلسة (مطلوب)
- `firebase_api_key.txt` - مفتاح Firebase API (مطلوب للمصادقة)
- `firebase_project_id.txt` - معرف مشروع Firebase
- `firebase_app_id.txt` - معرف تطبيق Firebase
- `openai_api_key.txt` - مفتاح OpenAI API
- `gemini_api_key.txt` - مفتاح Gemini API
- `deepseek_api_key.txt` - مفتاح Deepseek API
- `youtube_api_key.txt` - مفتاح YouTube API
- `sendgrid_api_key.txt` - مفتاح SendGrid API

## ملاحظات أمنية مهمة

- أضف هذا المجلد `config/secrets/` إلى ملف `.gitignore` للتأكد من عدم رفعه إلى GitHub
- لا تقم أبداً برفع هذه الملفات إلى مستودع عام
- في بيئة الإنتاج، يُفضل استخدام متغيرات البيئة بدلاً من الملفات