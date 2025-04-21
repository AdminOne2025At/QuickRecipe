#!/usr/bin/env node

/**
 * سكريبت إعداد تلقائي للمشروع
 * يقوم هذا السكريبت بإنشاء هيكل المجلدات اللازمة وإعداد ملفات السيكريت الأساسية
 * 
 * طريقة الاستخدام: 
 * - قم بتشغيل: node setup.js
 * - اتبع التعليمات على الشاشة
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const secretsDir = path.join(__dirname, 'config', 'secrets');
const templateDir = path.join(__dirname, 'config', 'templates');

// إنشاء واجهة القراءة والكتابة التفاعلية
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// وظيفة لعرض معلومات حول المشروع
function showWelcomeMessage() {
  console.log(`
=================================================
                Quick Recipe
        سكريبت الإعداد التلقائي للمشروع
=================================================
  
هذا السكريبت سيساعدك في إعداد مشروع Quick Recipe.
سيقوم بإنشاء المجلدات اللازمة وإعداد ملفات التكوين الأساسية.

يمكنك الإجابة على الأسئلة التالية أو تركها فارغة لاستخدام القيم الافتراضية.
`);
}

// وظيفة للتحقق من وجود المجلدات وإنشائها إذا لزم الأمر
function ensureDirectoriesExist() {
  const directories = [
    path.join(__dirname, 'config'),
    secretsDir,
    templateDir
  ];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`تم إنشاء المجلد: ${dir}`);
    }
  });
}

// وظيفة لإنشاء ملف سيكريت
function createSecretFile(filename, value) {
  const filePath = path.join(secretsDir, filename);
  try {
    fs.writeFileSync(filePath, value);
    return true;
  } catch (error) {
    console.error(`خطأ أثناء إنشاء ملف ${filename}:`, error.message);
    return false;
  }
}

// وظيفة للتحقق مما إذا كان ملف .env موجوداً
function checkDotEnvFile() {
  const envFilePath = path.join(__dirname, '.env');
  return fs.existsSync(envFilePath);
}

// وظيفة لنسخ ملفات النماذج
function copyExampleFiles() {
  const examples = {
    'EXAMPLE.firebase_api_key.txt': 'firebase_api_key.txt',
    'EXAMPLE.firebase_project_id.txt': 'firebase_project_id.txt',
    'EXAMPLE.firebase_app_id.txt': 'firebase_app_id.txt',
    'EXAMPLE.database_url.txt': 'database_url.txt',
    'EXAMPLE.openai_api_key.txt': 'openai_api_key.txt'
  };

  console.log('\nإنشاء ملفات سيكريت نموذجية...');
  
  Object.entries(examples).forEach(([example, target]) => {
    // التحقق أولاً من وجود الملف النموذجي
    const examplePath = path.join(secretsDir, example);
    const targetPath = path.join(secretsDir, target);
    
    // التحقق مما إذا كان ملف الهدف موجوداً بالفعل
    if (fs.existsSync(targetPath)) {
      console.log(`${target} موجود بالفعل، تم تخطيه.`);
      return;
    }
    
    // التحقق مما إذا كان ملف النموذج موجوداً
    if (fs.existsSync(examplePath)) {
      try {
        const content = fs.readFileSync(examplePath, 'utf8');
        fs.writeFileSync(targetPath, content);
        console.log(`تم إنشاء ${target} من النموذج`);
      } catch (error) {
        console.error(`خطأ أثناء نسخ الملف ${example}:`, error.message);
      }
    } else {
      console.log(`ملف النموذج ${example} غير موجود.`);
    }
  });
}

// وظيفة لإظهار رسالة النجاح النهائية
function showSuccessMessage() {
  console.log(`
=================================================
       تم اكتمال الإعداد بنجاح!  
=================================================

للبدء باستخدام التطبيق:

1. قم بتحرير ملفات السيكرت في مجلد config/secrets/ 
   بإضافة المفاتيح والقيم الحقيقية الخاصة بك.

2. قم بتشغيل التطبيق:
   npm run dev

لمزيد من المعلومات، راجع ملف README.md
أو قم بزيارة المستودع على GitHub.

شكراً لاستخدامك Quick Recipe! 🍲
`);
}

// وظيفة للسؤال عن مفاتيح Firebase
async function askForFirebaseConfig() {
  return new Promise((resolve) => {
    console.log('\nإعداد مفاتيح Firebase (مطلوبة للمصادقة):');
    
    rl.question('أدخل Firebase API Key (اتركها فارغة للتخطي): ', (apiKey) => {
      rl.question('أدخل Firebase Project ID (اتركها فارغة لاستخدام fast-recipe-2025): ', (projectId) => {
        rl.question('أدخل Firebase App ID (اتركها فارغة للتخطي): ', (appId) => {
          const config = {
            apiKey: apiKey.trim(),
            projectId: projectId.trim() || 'fast-recipe-2025',
            appId: appId.trim()
          };
          
          resolve(config);
        });
      });
    });
  });
}

// الوظيفة الرئيسية التي تنفذ الإعداد
async function runSetup() {
  showWelcomeMessage();
  ensureDirectoriesExist();
  
  const hasDotEnv = checkDotEnvFile();
  if (hasDotEnv) {
    console.log('\nتم العثور على ملف .env');
    rl.question('هل ترغب في تحويله إلى ملفات سيكريت؟ (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y') {
        console.log('\nجاري تحويل ملف .env إلى ملفات سيكريت...');
        // استدعاء سكريبت التحويل
        import('./config/migrate-env-to-secrets.js')
          .then(() => {
            finishSetup();
          })
          .catch(error => {
            console.error('خطأ أثناء تحويل ملف .env:', error.message);
            finishSetup();
          });
      } else {
        finishSetup();
      }
    });
  } else {
    finishSetup();
  }
}

async function finishSetup() {
  // نسخ ملفات النماذج أولاً
  copyExampleFiles();
  
  // سؤال المستخدم عن مفاتيح Firebase
  const firebaseConfig = await askForFirebaseConfig();
  
  // حفظ مفاتيح Firebase إذا تم إدخالها
  if (firebaseConfig.apiKey) {
    createSecretFile('firebase_api_key.txt', firebaseConfig.apiKey);
  }
  
  createSecretFile('firebase_project_id.txt', firebaseConfig.projectId);
  
  if (firebaseConfig.appId) {
    createSecretFile('firebase_app_id.txt', firebaseConfig.appId);
  }
  
  // عرض رسالة النجاح وإغلاق واجهة القراءة والكتابة
  showSuccessMessage();
  rl.close();
}

// بدء تنفيذ السكريبت
runSetup();