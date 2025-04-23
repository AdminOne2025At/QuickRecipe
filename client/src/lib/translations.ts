import { Language } from '@/components/LanguageSelector';

export const translations: Record<string, Record<Language, string>> = {
  // Ingredients Component
  'yourIngredients': {
    'ar-EG': 'مكوناتك المتاحة',
    'ar-SA': 'مكوناتك المتاحة',
    'en-US': 'Your Available Ingredients'
  },
  'addIngredient': {
    'ar-EG': 'أضف مكون',
    'ar-SA': 'أضف مكون',
    'en-US': 'Add Ingredient'
  },
  'clearAll': {
    'ar-EG': 'مسح الكل',
    'ar-SA': 'مسح الكل',
    'en-US': 'Clear All'
  },
  
  // Ingredient Substitution Component
  'ingredientSubstitutes': {
    'ar-EG': 'بدائل المكونات',
    'ar-SA': 'بدائل المكونات',
    'en-US': 'Ingredient Substitutes'
  },
  'enterIngredient': {
    'ar-EG': 'أدخل اسم المكون',
    'ar-SA': 'أدخل اسم المكون',
    'en-US': 'Enter ingredient name'
  },
  'search': {
    'ar-EG': 'بحث',
    'ar-SA': 'بحث',
    'en-US': 'Search'
  },
  'commonIngredients': {
    'ar-EG': 'مكونات شائعة',
    'ar-SA': 'مكونات شائعة',
    'en-US': 'Common Ingredients'
  },
  'recentSearches': {
    'ar-EG': 'عمليات البحث الأخيرة',
    'ar-SA': 'عمليات البحث الأخيرة',
    'en-US': 'Recent Searches'
  },
  'noRecentSearches': {
    'ar-EG': 'لا توجد عمليات بحث سابقة',
    'ar-SA': 'لا توجد عمليات بحث سابقة',
    'en-US': 'No recent searches'
  },
  'substitutesFor': {
    'ar-EG': 'بدائل لـ',
    'ar-SA': 'بدائل لـ',
    'en-US': 'Substitutes for'
  },
  'noSubstitutesFound': {
    'ar-EG': 'لم يتم العثور على بدائل',
    'ar-SA': 'لم يتم العثور على بدائل',
    'en-US': 'No substitutes found'
  },
  
  // Recipe Results Component
  'instructions': {
    'ar-EG': 'طريقة التحضير',
    'ar-SA': 'طريقة التحضير',
    'en-US': 'Instructions'
  },
  'watchVideo': {
    'ar-EG': 'شاهد الفيديو',
    'ar-SA': 'شاهد الفيديو',
    'en-US': 'Watch Video'
  },
  
  // Suggested Ingredients Component
  'suggestedIngredients': {
    'ar-EG': 'مكونات مقترحة',
    'ar-SA': 'مكونات مقترحة',
    'en-US': 'Suggested Ingredients'
  },
  
  // Auth Page Translations
  'welcomeToQuickRecipe': {
    'ar-EG': 'مرحباً بك في Quick Recipe',
    'ar-SA': 'مرحباً بك في Quick Recipe',
    'en-US': 'Welcome to Quick Recipe'
  },
  'loginForSpecialFeatures': {
    'ar-EG': 'سجل دخولك للوصول إلى مميزات خاصة',
    'ar-SA': 'سجل دخولك للوصول إلى مميزات خاصة',
    'en-US': 'Sign in to access special features'
  },
  'loginWithGoogle': {
    'ar-EG': 'تسجيل الدخول باستخدام Google',
    'ar-SA': 'تسجيل الدخول باستخدام Google',
    'en-US': 'Sign in with Google'
  },
  'noteGoogleDisabled': {
    'ar-EG': 'ملاحظة: تسجيل الدخول بجوجل معطل حالياً',
    'ar-SA': 'ملاحظة: تسجيل الدخول بجوجل معطل حالياً',
    'en-US': 'Note: Google login is currently disabled'
  },
  'googleLoginInstructions': {
    'ar-EG': 'يجب إضافة نطاق الموقع إلى قائمة النطاقات المسموح بها في إعدادات Firebase. يرجى استخدام خيار "تخطي تسجيل الدخول" أدناه.',
    'ar-SA': 'يجب إضافة نطاق الموقع إلى قائمة النطاقات المسموح بها في إعدادات Firebase. يرجى استخدام خيار "تخطي تسجيل الدخول" أدناه.',
    'en-US': 'The site domain must be added to the allowed domains in Firebase settings. Please use the "Quick Login" option below.'
  },
  'quickLogin': {
    'ar-EG': 'دخول سريع (الخيار الموصى به)',
    'ar-SA': 'دخول سريع (الخيار الموصى به)',
    'en-US': 'Quick Login (Recommended)'
  },
  'adminLogin': {
    'ar-EG': 'دخول المشرفين',
    'ar-SA': 'دخول المشرفين',
    'en-US': 'Admin Login'
  },
  'adminEntrance': {
    'ar-EG': 'بوابة دخول المشرفين',
    'ar-SA': 'بوابة دخول المشرفين',
    'en-US': 'Admin Entrance'
  },
  'loginInfoTitle': {
    'ar-EG': 'معلومات عن تسجيل الدخول:',
    'ar-SA': 'معلومات عن تسجيل الدخول:',
    'en-US': 'Login Information:'
  },
  'quickLoginDescription': {
    'ar-EG': 'يعمل خيار "دخول سريع" على تمكينك من استخدام جميع وظائف التطبيق بسرعة دون الحاجة إلى حساب جوجل أو بريد إلكتروني. نوصي باستخدام هذا الخيار للتجربة الأفضل.',
    'ar-SA': 'يعمل خيار "دخول سريع" على تمكينك من استخدام جميع وظائف التطبيق بسرعة دون الحاجة إلى حساب جوجل أو بريد إلكتروني. نوصي باستخدام هذا الخيار للتجربة الأفضل.',
    'en-US': 'The "Quick Login" option lets you use all app functions quickly without needing a Google account or email. We recommend this option for the best experience.'
  },
  'termsAgreement': {
    'ar-EG': 'بالتسجيل، أنت توافق على شروط الاستخدام وسياسة الخصوصية',
    'ar-SA': 'بالتسجيل، أنت توافق على شروط الاستخدام وسياسة الخصوصية',
    'en-US': 'By signing in, you agree to the Terms of Use and Privacy Policy'
  },
  'discoverTitle': {
    'ar-EG': 'اكتشف وصفات جديدة وشهية',
    'ar-SA': 'اكتشف وصفات جديدة وشهية',
    'en-US': 'Discover New & Delicious Recipes'
  },
  'appDescription': {
    'ar-EG': 'مع Quick Recipe، يمكنك إيجاد وصفات لذيذة باستخدام المكونات المتاحة لديك. سجّل دخولك للحصول على إمكانية حفظ وصفاتك المفضلة، وتخصيص تفضيلاتك، والمزيد!',
    'ar-SA': 'مع Quick Recipe، يمكنك إيجاد وصفات لذيذة باستخدام المكونات المتاحة لديك. سجّل دخولك للحصول على إمكانية حفظ وصفاتك المفضلة، وتخصيص تفضيلاتك، والمزيد!',
    'en-US': 'With Quick Recipe, you can find delicious recipes using your available ingredients. Sign in to save your favorite recipes, customize preferences, and more!'
  },
  'saveFavorites': {
    'ar-EG': 'حفظ المفضلة',
    'ar-SA': 'حفظ المفضلة',
    'en-US': 'Save Favorites'
  },
  'saveFavoritesDesc': {
    'ar-EG': 'احفظ وصفاتك المفضلة للرجوع إليها لاحقاً',
    'ar-SA': 'احفظ وصفاتك المفضلة للرجوع إليها لاحقاً',
    'en-US': 'Save your favorite recipes for later access'
  },
  'customizePreferences': {
    'ar-EG': 'تخصيص التفضيلات',
    'ar-SA': 'تخصيص التفضيلات',
    'en-US': 'Customize Preferences'
  },
  'customizePreferencesDesc': {
    'ar-EG': 'خصص تفضيلاتك الغذائية للحصول على اقتراحات مناسبة',
    'ar-SA': 'خصص تفضيلاتك الغذائية للحصول على اقتراحات مناسبة',
    'en-US': 'Customize your dietary preferences for suitable suggestions'
  },
  'ingredientSubstitutionsTitle': {
    'ar-EG': 'بدائل المكونات',
    'ar-SA': 'بدائل المكونات',
    'en-US': 'Ingredient Substitutions'
  },
  'ingredientSubstitutionsDesc': {
    'ar-EG': 'احصل على اقتراحات لبدائل المكونات غير المتوفرة',
    'ar-SA': 'احصل على اقتراحات لبدائل المكونات غير المتوفرة',
    'en-US': 'Get suggestions for unavailable ingredient substitutes'
  },
  'crossDeviceSync': {
    'ar-EG': 'مزامنة عبر الأجهزة',
    'ar-SA': 'مزامنة عبر الأجهزة',
    'en-US': 'Cross-Device Sync'
  },
  'crossDeviceSyncDesc': {
    'ar-EG': 'استمتع بتجربة سلسة عبر جميع أجهزتك',
    'ar-SA': 'استمتع بتجربة سلسة عبر جميع أجهزتك',
    'en-US': 'Enjoy a seamless experience across all your devices'
  },
  
  // UserMenu Translations
  'profile': {
    'ar-EG': 'الملف الشخصي',
    'ar-SA': 'الملف الشخصي',
    'en-US': 'Profile'
  },
  'settingsUserMenu': {
    'ar-EG': 'الإعدادات',
    'ar-SA': 'الإعدادات',
    'en-US': 'Settings'
  },
  'logOut': {
    'ar-EG': 'تسجيل الخروج',
    'ar-SA': 'تسجيل الخروج',
    'en-US': 'Log Out'
  },
  'signIn': {
    'ar-EG': 'تسجيل الدخول',
    'ar-SA': 'تسجيل الدخول',
    'en-US': 'Sign In'
  },
  
  // Profile Page Translations
  'profilePage': {
    'ar-EG': 'الملف الشخصي',
    'ar-SA': 'الملف الشخصي',
    'en-US': 'Profile'
  },
  'personalInfo': {
    'ar-EG': 'المعلومات الشخصية',
    'ar-SA': 'المعلومات الشخصية',
    'en-US': 'Personal Information'
  },
  'personalInfoDesc': {
    'ar-EG': 'قم بتعديل معلومات حسابك هنا. بعد الانتهاء، انقر على حفظ التغييرات.',
    'ar-SA': 'قم بتعديل معلومات حسابك هنا. بعد الانتهاء، انقر على حفظ التغييرات.',
    'en-US': 'Edit your account information here. When finished, click Save Changes.'
  },
  'displayName': {
    'ar-EG': 'الاسم',
    'ar-SA': 'الاسم',
    'en-US': 'Name'
  },
  'enterName': {
    'ar-EG': 'أدخل اسمك',
    'ar-SA': 'أدخل اسمك',
    'en-US': 'Enter your name'
  },
  'email': {
    'ar-EG': 'البريد الإلكتروني',
    'ar-SA': 'البريد الإلكتروني',
    'en-US': 'Email'
  },
  'emailGoogleDesc': {
    'ar-EG': 'لا يمكن تغيير البريد الإلكتروني المرتبط بحساب Google.',
    'ar-SA': 'لا يمكن تغيير البريد الإلكتروني المرتبط بحساب Google.',
    'en-US': 'You cannot change the email associated with your Google account.'
  },
  'signOutAccount': {
    'ar-EG': 'تسجيل الخروج من الحساب',
    'ar-SA': 'تسجيل الخروج من الحساب',
    'en-US': 'Sign Out of Account'
  },
  'saveChanges': {
    'ar-EG': 'حفظ التغييرات',
    'ar-SA': 'حفظ التغييرات',
    'en-US': 'Save Changes'
  },
  'preferencesTab': {
    'ar-EG': 'الإعدادات',
    'ar-SA': 'الإعدادات',
    'en-US': 'Preferences'
  },
  'adminPanelTab': {
    'ar-EG': 'لوحة المشرف',
    'ar-SA': 'لوحة المشرف',
    'en-US': 'Admin Panel'
  },
  'preferencesTitle': {
    'ar-EG': 'الإعدادات والتفضيلات',
    'ar-SA': 'الإعدادات والتفضيلات',
    'en-US': 'Settings & Preferences'
  },
  'preferencesDesc': {
    'ar-EG': 'خصص تجربتك في تطبيق Quick Recipe حسب اختياراتك.',
    'ar-SA': 'خصص تجربتك في تطبيق Quick Recipe حسب اختياراتك.',
    'en-US': 'Customize your Quick Recipe experience according to your preferences.'
  },
  'appearance': {
    'ar-EG': 'المظهر',
    'ar-SA': 'المظهر',
    'en-US': 'Appearance'
  },
  'displayMode': {
    'ar-EG': 'وضع العرض',
    'ar-SA': 'وضع العرض',
    'en-US': 'Display Mode'
  },
  'lightMode': {
    'ar-EG': 'فاتح',
    'ar-SA': 'فاتح',
    'en-US': 'Light'
  },
  'darkMode': {
    'ar-EG': 'داكن',
    'ar-SA': 'داكن',
    'en-US': 'Dark'
  },
  'systemMode': {
    'ar-EG': 'تلقائي (حسب النظام)',
    'ar-SA': 'تلقائي (حسب النظام)',
    'en-US': 'Automatic (System)'
  },
  'notifications': {
    'ar-EG': 'الإشعارات',
    'ar-SA': 'الإشعارات',
    'en-US': 'Notifications'
  },
  'enableNotifications': {
    'ar-EG': 'تفعيل الإشعارات',
    'ar-SA': 'تفعيل الإشعارات',
    'en-US': 'Enable Notifications'
  },
  'foodPreferences': {
    'ar-EG': 'تفضيلات الطعام',
    'ar-SA': 'تفضيلات الطعام',
    'en-US': 'Food Preferences'
  },
  'favoriteCuisine': {
    'ar-EG': 'المطبخ المفضل',
    'ar-SA': 'المطبخ المفضل',
    'en-US': 'Favorite Cuisine'
  },
  'saveSettings': {
    'ar-EG': 'حفظ الإعدادات',
    'ar-SA': 'حفظ الإعدادات',
    'en-US': 'Save Settings'
  },
  'uploadingImage': {
    'ar-EG': 'جاري رفع الصورة...',
    'ar-SA': 'جاري رفع الصورة...',
    'en-US': 'Uploading image...'
  },
  // Admin Dashboard Welcome Messages
  'adminGreeting': {
    'ar-EG': 'مرحباً بالمشرف',
    'ar-SA': 'مرحباً بالمشرف',
    'en-US': 'Welcome, Admin'
  },
  'adminPrivilegesMessage': {
    'ar-EG': 'لديك صلاحيات الإشراف على منصة كويك ريسب',
    'ar-SA': 'لديك صلاحيات الإشراف على منصة كويك ريسب',
    'en-US': 'You have administrative privileges on the Quick Recipe platform'
  },
  'adminLoginSuccessMessage': {
    'ar-EG': 'تم تسجيل دخولك كمشرف بنجاح. يمكنك الآن إدارة المحتوى.',
    'ar-SA': 'تم تسجيل دخولك كمشرف بنجاح. يمكنك الآن إدارة المحتوى.',
    'en-US': 'You have successfully logged in as an administrator. You can now manage content.'
  },
  'accessDenied': {
    'ar-EG': 'وصول مرفوض',
    'ar-SA': 'وصول مرفوض',
    'en-US': 'Access Denied'
  },
  'loginRequired': {
    'ar-EG': 'يجب تسجيل الدخول للوصول إلى هذه الصفحة',
    'ar-SA': 'يجب تسجيل الدخول للوصول إلى هذه الصفحة',
    'en-US': 'You must be logged in to access this page'
  },
  'adminOnlyPage': {
    'ar-EG': 'هذه الصفحة متاحة للمشرفين فقط',
    'ar-SA': 'هذه الصفحة متاحة للمشرفين فقط',
    'en-US': 'This page is for administrators only'
  },
  'adminFullPrivilegesMessage': {
    'ar-EG': 'أنت تتصفح المنصة حاليًا بصلاحيات مشرف كاملة',
    'ar-SA': 'أنت تتصفح المنصة حاليًا بصلاحيات مشرف كاملة',
    'en-US': 'You are currently browsing the platform with full admin privileges'
  },
  'platformStats': {
    'ar-EG': 'إحصائيات المنصة',
    'ar-SA': 'إحصائيات المنصة',
    'en-US': 'Platform Statistics'
  },
  'quickLinks': {
    'ar-EG': 'روابط سريعة',
    'ar-SA': 'روابط سريعة',
    'en-US': 'Quick Links'
  },
  'manageCommunityPosts': {
    'ar-EG': 'إدارة منشورات المجتمع',
    'ar-SA': 'إدارة منشورات المجتمع',
    'en-US': 'Manage Community Posts'
  },
  'openDiscordChannel': {
    'ar-EG': 'فتح قناة Discord',
    'ar-SA': 'فتح قناة Discord',
    'en-US': 'Open Discord Channel'
  },
  'loggedOut': {
    'ar-EG': 'تم تسجيل الخروج',
    'ar-SA': 'تم تسجيل الخروج',
    'en-US': 'Logged Out'
  },
  'logoutSuccessMessage': {
    'ar-EG': 'تم تسجيل خروجك بنجاح',
    'ar-SA': 'تم تسجيل خروجك بنجاح',
    'en-US': 'You have been successfully logged out'
  },
  'adminInfo': {
    'ar-EG': 'معلومات المشرف',
    'ar-SA': 'معلومات المشرف',
    'en-US': 'Admin Information'
  },
  'adminStatus': {
    'ar-EG': 'حالة المشرف',
    'ar-SA': 'حالة المشرف',
    'en-US': 'Admin Status'
  },
  'active': {
    'ar-EG': 'نشط',
    'ar-SA': 'نشط',
    'en-US': 'Active'
  },
  'inactive': {
    'ar-EG': 'غير نشط',
    'ar-SA': 'غير نشط',
    'en-US': 'Inactive'
  },
  'systemAdmin': {
    'ar-EG': 'مشرف النظام',
    'ar-SA': 'مشرف النظام',
    'en-US': 'System Admin'
  },
  'currentUserInfo': {
    'ar-EG': 'معلومات المستخدم الحالي',
    'ar-SA': 'معلومات المستخدم الحالي',
    'en-US': 'Current User Info'
  },
  'logout': {
    'ar-EG': 'تسجيل الخروج',
    'ar-SA': 'تسجيل الخروج',
    'en-US': 'Logout'
  },
  'showAdminStatus': {
    'ar-EG': 'إظهار حالة المشرف',
    'ar-SA': 'إظهار حالة المشرف',
    'en-US': 'Show Admin Status'
  },

  // General Admin Dashboard
  'adminDashboard': {
    'ar-EG': 'لوحة تحكم المشرف',
    'ar-SA': 'لوحة تحكم المشرف',
    'en-US': 'Admin Dashboard'
  },
  'returnToHomepage': {
    'ar-EG': 'العودة إلى الصفحة الرئيسية',
    'ar-SA': 'العودة إلى الصفحة الرئيسية',
    'en-US': 'Return to Homepage'
  },
  'adminDashboardDesc': {
    'ar-EG': 'هنا يمكنك إدارة المحتوى ومراقبة المنشورات والإشراف على المنصة',
    'ar-SA': 'هنا يمكنك إدارة المحتوى ومراقبة المنشورات والإشراف على المنصة',
    'en-US': 'Here you can manage content, monitor posts, and supervise the platform'
  },

  // Admin Dashboard Tabs
  'overview': {
    'ar-EG': 'نظرة عامة',
    'ar-SA': 'نظرة عامة',
    'en-US': 'Overview'
  },
  'reportsTab': {
    'ar-EG': 'البلاغات',
    'ar-SA': 'البلاغات',
    'en-US': 'Reports'
  },
  'settings': {
    'ar-EG': 'الإعدادات',
    'ar-SA': 'الإعدادات',
    'en-US': 'Settings'
  },

  // Admin Dashboard Stats
  'posts': {
    'ar-EG': 'المنشورات',
    'ar-SA': 'المنشورات',
    'en-US': 'Posts'
  },
  'users': {
    'ar-EG': 'المستخدمين',
    'ar-SA': 'المستخدمين',
    'en-US': 'Users'
  },
  'reportsHeader': {
    'ar-EG': 'البلاغات',
    'ar-SA': 'البلاغات',
    'en-US': 'Reports'
  },
  'communityPosts': {
    'ar-EG': 'منشورات المجتمع',
    'ar-SA': 'منشورات المجتمع',
    'en-US': 'Community Posts'
  },
  'newUsersThisWeek': {
    'ar-EG': 'مستخدمين جدد هذا الأسبوع',
    'ar-SA': 'مستخدمين جدد هذا الأسبوع',
    'en-US': 'new users this week'
  },
  'pendingReports': {
    'ar-EG': 'بلاغات قيد المراجعة',
    'ar-SA': 'بلاغات قيد المراجعة',
    'en-US': 'pending reviews'
  },

  // Admin Dashboard Content Cards
  'latestPosts': {
    'ar-EG': 'آخر المنشورات',
    'ar-SA': 'آخر المنشورات',
    'en-US': 'Latest Posts'
  },
  'latestPostsDesc': {
    'ar-EG': 'استعراض آخر المنشورات التي تمت إضافتها في المجتمع',
    'ar-SA': 'استعراض آخر المنشورات التي تمت إضافتها في المجتمع',
    'en-US': 'View the most recent posts added to the community'
  },
  'loadingPosts': {
    'ar-EG': 'جاري تحميل المنشورات...',
    'ar-SA': 'جاري تحميل المنشورات...',
    'en-US': 'Loading posts...'
  },
  'noPosts': {
    'ar-EG': 'لا توجد منشورات حتى الآن',
    'ar-SA': 'لا توجد منشورات حتى الآن',
    'en-US': 'No posts yet'
  },
  'by': {
    'ar-EG': 'بواسطة',
    'ar-SA': 'بواسطة',
    'en-US': 'by'
  },
  'user': {
    'ar-EG': 'مستخدم',
    'ar-SA': 'مستخدم',
    'en-US': 'User'
  },
  'viewPost': {
    'ar-EG': 'عرض المنشور',
    'ar-SA': 'عرض المنشور',
    'en-US': 'View Post'
  },
  'viewAllPosts': {
    'ar-EG': 'عرض جميع المنشورات',
    'ar-SA': 'عرض جميع المنشورات',
    'en-US': 'View All Posts'
  },

  // Admin Dashboard Reports
  'reportsAndReportedPosts': {
    'ar-EG': 'البلاغات والمنشورات المبلغ عنها',
    'ar-SA': 'البلاغات والمنشورات المبلغ عنها',
    'en-US': 'Reports & Reported Posts'
  },
  'postsReportedByUsers': {
    'ar-EG': 'المنشورات التي تم الإبلاغ عنها من قبل المستخدمين',
    'ar-SA': 'المنشورات التي تم الإبلاغ عنها من قبل المستخدمين',
    'en-US': 'Posts reported by users'
  },
  'loadingReports': {
    'ar-EG': 'جاري تحميل البلاغات...',
    'ar-SA': 'جاري تحميل البلاغات...',
    'en-US': 'Loading reports...'
  },
  'noReportsYet': {
    'ar-EG': 'لا توجد بلاغات حتى الآن',
    'ar-SA': 'لا توجد بلاغات حتى الآن',
    'en-US': 'No reports yet'
  },
  'report': {
    'ar-EG': 'بلاغ',
    'ar-SA': 'بلاغ',
    'en-US': 'report'
  },
  'postDate': {
    'ar-EG': 'تاريخ النشر',
    'ar-SA': 'تاريخ النشر',
    'en-US': 'Post Date'
  },
  'pendingReview': {
    'ar-EG': 'قيد المراجعة',
    'ar-SA': 'قيد المراجعة',
    'en-US': 'Pending Review'
  },
  'reachedMaximum': {
    'ar-EG': 'وصل للحد الأقصى',
    'ar-SA': 'وصل للحد الأقصى',
    'en-US': 'Maximum Reached'
  },
  'postReachedMaximumReports': {
    'ar-EG': 'تنبيه: هذا المنشور وصل للحد الأقصى من البلاغات',
    'ar-SA': 'تنبيه: هذا المنشور وصل للحد الأقصى من البلاغات',
    'en-US': 'Alert: This post has reached the maximum number of reports'
  },
  'alert': {
    'ar-EG': 'تنبيه',
    'ar-SA': 'تنبيه',
    'en-US': 'Alert'
  },
  'refresh': {
    'ar-EG': 'تحديث',
    'ar-SA': 'تحديث',
    'en-US': 'Refresh'
  },
  'noTitlePost': {
    'ar-EG': 'منشور بدون عنوان',
    'ar-SA': 'منشور بدون عنوان',
    'en-US': 'Post without title'
  },
  'failedToFetchReports': {
    'ar-EG': 'فشل في جلب البلاغات',
    'ar-SA': 'فشل في جلب البلاغات',
    'en-US': 'Failed to fetch reports'
  },

  // Admin Dashboard Settings
  'adminTools': {
    'ar-EG': 'أدوات المشرف',
    'ar-SA': 'أدوات المشرف',
    'en-US': 'Admin Tools'
  },
  'contentManagementTools': {
    'ar-EG': 'أدوات إدارة المحتوى',
    'ar-SA': 'أدوات إدارة المحتوى',
    'en-US': 'Content Management Tools'
  },
  'deleteAllPosts': {
    'ar-EG': 'حذف جميع المنشورات',
    'ar-SA': 'حذف جميع المنشورات',
    'en-US': 'Delete All Posts'
  },
  'warningDeleteAllPosts': {
    'ar-EG': 'تحذير: حذف كافة المنشورات',
    'ar-SA': 'تحذير: حذف كافة المنشورات',
    'en-US': 'Warning: Delete All Posts'
  },
  'deleteAllPostsBtn': {
    'ar-EG': 'حذف جميع المنشورات',
    'ar-SA': 'حذف جميع المنشورات',
    'en-US': 'Delete All Posts'
  },
  'deletePost': {
    'ar-EG': 'حذف المنشور',
    'ar-SA': 'حذف المنشور',
    'en-US': 'Delete Post'
  },
  'confirmDeletePost': {
    'ar-EG': 'تأكيد حذف المنشور',
    'ar-SA': 'تأكيد حذف المنشور',
    'en-US': 'Confirm Post Deletion'
  },
  'confirmDeletePostMessage': {
    'ar-EG': 'هل أنت متأكد من أنك تريد حذف المنشور {postTitle}؟',
    'ar-SA': 'هل أنت متأكد من أنك تريد حذف المنشور {postTitle}؟',
    'en-US': 'Are you sure you want to delete the post {postTitle}?'
  },
  'confirmDeleteAllPosts': {
    'ar-EG': 'تأكيد حذف جميع المنشورات',
    'ar-SA': 'تأكيد حذف جميع المنشورات',
    'en-US': 'Confirm Deletion of All Posts'
  },
  'deleteAllPostsWarningText': {
    'ar-EG': 'أنت على وشك حذف جميع المنشورات من قاعدة البيانات. هذا الإجراء لا يمكن التراجع عنه وسيؤدي إلى فقدان جميع البيانات المرتبطة بها.',
    'ar-SA': 'أنت على وشك حذف جميع المنشورات من قاعدة البيانات. هذا الإجراء لا يمكن التراجع عنه وسيؤدي إلى فقدان جميع البيانات المرتبطة بها.',
    'en-US': 'You are about to delete ALL posts from the database. This action cannot be undone and will result in the loss of all associated data.'
  },
  'deleteAllPostsDetails': {
    'ar-EG': 'سيتم حذف جميع المنشورات والتعليقات والتقييمات المرتبطة بها بشكل نهائي.',
    'ar-SA': 'سيتم حذف جميع المنشورات والتعليقات والتقييمات المرتبطة بها بشكل نهائي.',
    'en-US': 'All posts and their associated comments and ratings will be permanently deleted.'
  },
  'confirmIrreversibleAction': {
    'ar-EG': 'أؤكد أنني أفهم أن هذا الإجراء لا يمكن التراجع عنه',
    'ar-SA': 'أؤكد أنني أفهم أن هذا الإجراء لا يمكن التراجع عنه',
    'en-US': 'I confirm that I understand this action is irreversible'
  },
  'irreversibleAction': {
    'ar-EG': 'إجراء لا يمكن التراجع عنه',
    'ar-SA': 'إجراء لا يمكن التراجع عنه',
    'en-US': 'Irreversible action'
  },
  'confirmationRequired': {
    'ar-EG': 'التأكيد مطلوب',
    'ar-SA': 'التأكيد مطلوب',
    'en-US': 'Confirmation Required'
  },
  'confirmUnderstanding': {
    'ar-EG': 'يرجى تأكيد فهمك لعواقب هذا الإجراء',
    'ar-SA': 'يرجى تأكيد فهمك لعواقب هذا الإجراء',
    'en-US': 'Please confirm your understanding of the consequences of this action'
  },
  'cancel': {
    'ar-EG': 'إلغاء',
    'ar-SA': 'إلغاء',
    'en-US': 'Cancel'
  },
  'confirmDelete': {
    'ar-EG': 'تأكيد الحذف',
    'ar-SA': 'تأكيد الحذف',
    'en-US': 'Confirm Delete'
  },
  'deleting': {
    'ar-EG': 'جاري الحذف...',
    'ar-SA': 'جاري الحذف...',
    'en-US': 'Deleting...'
  },
  'deletingAllPosts': {
    'ar-EG': 'جاري حذف جميع المنشورات...',
    'ar-SA': 'جاري حذف جميع المنشورات...',
    'en-US': 'Deleting all posts...'
  },
  'postDeleted': {
    'ar-EG': 'تم حذف المنشور',
    'ar-SA': 'تم حذف المنشور',
    'en-US': 'Post Deleted'
  },
  'postDeletedSuccess': {
    'ar-EG': 'تم حذف المنشور بنجاح',
    'ar-SA': 'تم حذف المنشور بنجاح',
    'en-US': 'Post has been successfully deleted'
  },
  'postDeleteFailed': {
    'ar-EG': 'فشل في حذف المنشور',
    'ar-SA': 'فشل في حذف المنشور',
    'en-US': 'Failed to delete post'
  },
  'allPostsDeleted': {
    'ar-EG': 'تم حذف جميع المنشورات',
    'ar-SA': 'تم حذف جميع المنشورات',
    'en-US': 'All Posts Deleted'
  },
  'allPostsDeletedSuccess': {
    'ar-EG': 'تم حذف {count} منشور بنجاح',
    'ar-SA': 'تم حذف {count} منشور بنجاح',
    'en-US': 'Successfully deleted {count} posts'
  },
  'allPostsDeleteFailed': {
    'ar-EG': 'فشل في حذف جميع المنشورات',
    'ar-SA': 'فشل في حذف جميع المنشورات',
    'en-US': 'Failed to delete all posts'
  },
  
  // Admin Dashboard - Statistics
  'usageStatistics': {
    'ar-EG': 'إحصائيات الاستخدام',
    'ar-SA': 'إحصائيات الاستخدام',
    'en-US': 'Usage Statistics'
  },
  'platformGrowth': {
    'ar-EG': 'نمو المنصة',
    'ar-SA': 'نمو المنصة',
    'en-US': 'Platform Growth'
  },
  'activityStats': {
    'ar-EG': 'إحصائيات النشاط',
    'ar-SA': 'إحصائيات النشاط',
    'en-US': 'Activity Statistics'
  },
  'activityStatsDesc': {
    'ar-EG': 'نظرة عامة على نشاط المستخدمين والمنصة',
    'ar-SA': 'نظرة عامة على نشاط المستخدمين والمنصة',
    'en-US': 'Overview of user and platform activity'
  },
  'activeUsersPercentage': {
    'ar-EG': 'نسبة المستخدمين النشطين',
    'ar-SA': 'نسبة المستخدمين النشطين',
    'en-US': 'Active Users Percentage'
  },
  'resolvedReportsPercentage': {
    'ar-EG': 'نسبة البلاغات المعالجة',
    'ar-SA': 'نسبة البلاغات المعالجة',
    'en-US': 'Resolved Reports Percentage'
  },
  
  // Admin Dashboard - Notification Settings
  'notificationSettings': {
    'ar-EG': 'إعدادات الإشعارات',
    'ar-SA': 'إعدادات الإشعارات',
    'en-US': 'Notification Settings'
  },
  'emailNotifications': {
    'ar-EG': 'إشعارات البريد الإلكتروني',
    'ar-SA': 'إشعارات البريد الإلكتروني',
    'en-US': 'Email Notifications'
  },
  'emailNotificationsDesc': {
    'ar-EG': 'إرسال إشعارات النظام عبر البريد الإلكتروني',
    'ar-SA': 'إرسال إشعارات النظام عبر البريد الإلكتروني',
    'en-US': 'Send system notifications via email'
  },
  'discordNotifications': {
    'ar-EG': 'إشعارات ديسكورد',
    'ar-SA': 'إشعارات ديسكورد',
    'en-US': 'Discord Notifications'
  },
  'discordNotificationsDesc': {
    'ar-EG': 'إرسال التنبيهات وتحديثات النظام إلى قناة ديسكورد',
    'ar-SA': 'إرسال التنبيهات وتحديثات النظام إلى قناة ديسكورد',
    'en-US': 'Send alerts and system updates to Discord channel'
  },
  'adminSaveSettings': {
    'ar-EG': 'حفظ الإعدادات',
    'ar-SA': 'حفظ الإعدادات',
    'en-US': 'Save Settings'
  },
  
  // Admin Dashboard - Moderation Settings
  'moderationSettings': {
    'ar-EG': 'إعدادات الإشراف',
    'ar-SA': 'إعدادات الإشراف',
    'en-US': 'Moderation Settings'
  },
  'moderationSettingsDesc': {
    'ar-EG': 'إدارة كيفية مراقبة المحتوى والمنشورات',
    'ar-SA': 'إدارة كيفية مراقبة المحتوى والمنشورات',
    'en-US': 'Manage how content and posts are moderated'
  },
  'contentModerationSettings': {
    'ar-EG': 'إعدادات مراقبة المحتوى',
    'ar-SA': 'إعدادات مراقبة المحتوى',
    'en-US': 'Content Moderation Settings'
  },
  'discordAlerts': {
    'ar-EG': 'تنبيهات Discord',
    'ar-SA': 'تنبيهات Discord',
    'en-US': 'Discord Alerts'
  },
  'sendDiscordNotifications': {
    'ar-EG': 'إرسال إشعارات Discord',
    'ar-SA': 'إرسال إشعارات Discord',
    'en-US': 'Send Discord Notifications'
  },
  'aiContentModeration': {
    'ar-EG': 'مراقبة المحتوى بالذكاء الاصطناعي',
    'ar-SA': 'مراقبة المحتوى بالذكاء الاصطناعي',
    'en-US': 'AI Content Moderation'
  },
  'aiContentModerationDesc': {
    'ar-EG': 'استخدام الذكاء الاصطناعي لاكتشاف المحتوى غير اللائق وتصفيته تلقائياً',
    'ar-SA': 'استخدام الذكاء الاصطناعي لاكتشاف المحتوى غير اللائق وتصفيته تلقائياً',
    'en-US': 'Use AI to detect and filter inappropriate content automatically'
  },
  'sendDiscordAlertsDesc': {
    'ar-EG': 'إرسال تنبيهات عن البلاغات الجديدة إلى قناة Discord',
    'ar-SA': 'إرسال تنبيهات عن البلاغات الجديدة إلى قناة Discord',
    'en-US': 'Send alerts about new reports to Discord channel'
  },
  'autoDeletePosts': {
    'ar-EG': 'الحذف التلقائي للمنشورات',
    'ar-SA': 'الحذف التلقائي للمنشورات',
    'en-US': 'Auto-delete Posts'
  },
  'autoDeletePostsDesc': {
    'ar-EG': 'حذف المنشورات التي تتجاوز حد البلاغات تلقائياً',
    'ar-SA': 'حذف المنشورات التي تتجاوز حد البلاغات تلقائياً',
    'en-US': 'Automatically delete posts that exceed the report threshold'
  }
};

export default translations;