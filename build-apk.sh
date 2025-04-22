#!/bin/bash

# سكريبت لبناء تطبيق أندرويد من موقع كويك ريسب
# ----------------------------------------------

# ألوان للعرض
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# وظيفة للطباعة بتنسيق
print_step() {
  echo -e "${YELLOW}==>${NC} ${BLUE}$1${NC}"
}

print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
  echo -e "${RED}✗ $1${NC}"
  exit 1
}

# التأكد من تثبيت الأدوات اللازمة
check_requirements() {
  print_step "التحقق من متطلبات النظام..."
  
  # التحقق من وجود Node.js
  if ! command -v node &> /dev/null; then
    print_error "لم يتم العثور على Node.js! يرجى تثبيته أولاً."
  fi
  
  # التحقق من إصدار Node.js
  NODE_VERSION=$(node -v | cut -d'v' -f2)
  NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1)
  if [ $NODE_MAJOR -lt 16 ]; then
    print_error "يجب أن يكون إصدار Node.js 16 أو أعلى. الإصدار الحالي: $NODE_VERSION"
  fi
  
  # التحقق من وجود npm
  if ! command -v npm &> /dev/null; then
    print_error "لم يتم العثور على npm! تأكد من تثبيت Node.js بشكل صحيح."
  fi
  
  print_success "جميع المتطلبات الأساسية متوفرة"
}

# بناء تطبيق الويب
build_web_app() {
  print_step "بناء تطبيق الويب..."
  
  # تثبيت التبعيات إذا لم تكن موجودة
  if [ ! -d "node_modules" ]; then
    print_step "تثبيت التبعيات..."
    npm install || print_error "فشل تثبيت التبعيات"
  fi
  
  # بناء النسخة النهائية من التطبيق
  print_step "بناء النسخة النهائية من التطبيق..."
  npm run build || print_error "فشل بناء التطبيق"
  
  print_success "تم بناء تطبيق الويب بنجاح"
}

# إعداد Capacitor
setup_capacitor() {
  print_step "إعداد Capacitor..."
  
  # تثبيت Capacitor إذا لم يكن موجوداً
  print_step "تثبيت حزم Capacitor اللازمة..."
  npm install @capacitor/cli @capacitor/android || print_error "فشل تثبيت حزم Capacitor"
  
  # التحقق مما إذا كانت منصة Android موجودة بالفعل
  if [ -d "android" ]; then
    print_step "منصة Android موجودة بالفعل، جاري تخطي الإضافة..."
  else
    # إضافة منصة Android
    print_step "إضافة منصة Android..."
    npx cap add android || print_error "فشل إضافة منصة Android"
  fi
  
  print_success "تم إعداد Capacitor بنجاح"
}

# نسخ ملفات القوالب المخصصة
copy_custom_files() {
  print_step "نسخ الملفات المخصصة إلى مشروع Android..."
  
  # التأكد من وجود مجلد android
  if [ ! -d "android" ]; then
    print_error "مجلد android غير موجود! تأكد من تنفيذ الخطوة السابقة بنجاح."
  fi
  
  # نسخ الملفات من مجلد القوالب
  TEMPLATE_DIR="android_templates"
  ANDROID_DIR="android/app/src/main"
  
  # نسخ ملفات Java
  mkdir -p "$ANDROID_DIR/java/com/egyptco/quickrecipe"
  cp -f "$TEMPLATE_DIR/src/main/java/com/egyptco/quickrecipe/"*.java "$ANDROID_DIR/java/com/egyptco/quickrecipe/" || print_error "فشل نسخ ملفات Java"
  
  # نسخ ملفات الموارد
  mkdir -p "$ANDROID_DIR/res/drawable"
  mkdir -p "$ANDROID_DIR/res/layout"
  mkdir -p "$ANDROID_DIR/res/values"
  
  cp -f "$TEMPLATE_DIR/src/main/res/drawable/"* "$ANDROID_DIR/res/drawable/" || print_error "فشل نسخ ملفات الرسومات"
  cp -f "$TEMPLATE_DIR/src/main/res/layout/"* "$ANDROID_DIR/res/layout/" || print_error "فشل نسخ ملفات التخطيط"
  cp -f "$TEMPLATE_DIR/src/main/res/values/"* "$ANDROID_DIR/res/values/" || print_error "فشل نسخ ملفات القيم"
  
  # نسخ AndroidManifest.xml
  cp -f "$TEMPLATE_DIR/src/main/AndroidManifest.xml" "$ANDROID_DIR/AndroidManifest.xml" || print_error "فشل نسخ ملف AndroidManifest.xml"
  
  print_success "تم نسخ الملفات المخصصة بنجاح"
}

# مزامنة المشروع مع Capacitor
sync_project() {
  print_step "مزامنة المشروع مع Capacitor..."
  npx cap sync android || print_error "فشل مزامنة المشروع"
  print_success "تمت المزامنة بنجاح"
}

# بناء APK باستخدام Gradle
build_apk() {
  print_step "بناء ملف APK..."
  
  # التحقق من وجود مجلد android
  if [ ! -d "android" ]; then
    print_error "مجلد android غير موجود! تأكد من تنفيذ الخطوات السابقة بنجاح."
  fi
  
  # الانتقال إلى مجلد Android وبناء APK
  cd android
  ./gradlew assembleDebug || print_error "فشل بناء APK"
  
  # التحقق من نجاح عملية البناء والعثور على ملف APK
  APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
  if [ -f "$APK_PATH" ]; then
    # نسخ APK إلى المجلد الرئيسي للمشروع
    cp "$APK_PATH" "../QuickRecipe.apk" || print_error "فشل نسخ APK إلى المجلد الرئيسي"
    cd ..
    print_success "تم إنشاء ملف APK بنجاح: QuickRecipe.apk"
  else
    cd ..
    print_error "لم يتم العثور على ملف APK بعد عملية البناء!"
  fi
}

# تنفيذ جميع الخطوات
main() {
  echo -e "${BLUE}=========================================${NC}"
  echo -e "${YELLOW}     بناء تطبيق كويك ريسب للأندرويد     ${NC}"
  echo -e "${BLUE}=========================================${NC}"
  
  check_requirements
  build_web_app
  setup_capacitor
  copy_custom_files
  sync_project
  build_apk
  
  echo -e "${BLUE}=========================================${NC}"
  echo -e "${GREEN}   تم إنشاء تطبيق كويك ريسب بنجاح!   ${NC}"
  echo -e "${BLUE}=========================================${NC}"
  echo -e "يمكنك الآن تثبيت الملف ${YELLOW}QuickRecipe.apk${NC} على جهاز أندرويد"
}

# تنفيذ البرنامج الرئيسي
main