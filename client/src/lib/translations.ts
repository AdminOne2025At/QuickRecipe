import { Language } from '@/components/LanguageSelector';

export const translations: Record<string, Record<Language, string>> = {
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
    'ar-EG': 'هذه الصفحة مخصصة للمشرفين فقط',
    'ar-SA': 'هذه الصفحة مخصصة للمشرفين فقط',
    'en-US': 'This page is for administrators only'
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
    'en-US': 'active'
  },
  'inactive': {
    'ar-EG': 'غير نشط',
    'ar-SA': 'غير نشط',
    'en-US': 'inactive'
  },
  'loggedOut': {
    'ar-EG': 'تم تسجيل الخروج',
    'ar-SA': 'تم تسجيل الخروج',
    'en-US': 'Logged Out'
  },
  'logoutSuccessMessage': {
    'ar-EG': 'تم تسجيل خروجك من النظام بنجاح',
    'ar-SA': 'تم تسجيل خروجك من النظام بنجاح',
    'en-US': 'You have been successfully logged out of the system'
  },
  'showAdminStatus': {
    'ar-EG': 'عرض حالة المشرف',
    'ar-SA': 'عرض حالة المشرف',
    'en-US': 'Show Admin Status'
  },
  'logout': {
    'ar-EG': 'تسجيل الخروج',
    'ar-SA': 'تسجيل الخروج',
    'en-US': 'Logout'
  },
  'adminTools': {
    'ar-EG': 'أدوات اختبار صلاحيات المشرف',
    'ar-SA': 'أدوات اختبار صلاحيات المشرف',
    'en-US': 'Admin Permissions Testing Tools'
  },
  'currentUserInfo': {
    'ar-EG': 'معلومات المستخدم الحالي',
    'ar-SA': 'معلومات المستخدم الحالي',
    'en-US': 'Current User Information'
  },
  'saveSettings': {
    'ar-EG': 'حفظ الإعدادات',
    'ar-SA': 'حفظ الإعدادات',
    'en-US': 'Save Settings'
  },
  // Admin Login Page
  'adminEntrance': {
    'ar-EG': 'مدخل المشرفين',
    'ar-SA': 'مدخل المشرفين',
    'en-US': 'Admin Portal'
  },
  'adminPanelOnly': {
    'ar-EG': 'لوحة التحكم الخاصة بالمشرفين فقط',
    'ar-SA': 'لوحة التحكم الخاصة بالمشرفين فقط',
    'en-US': 'Control panel for admins only'
  },
  'username': {
    'ar-EG': 'اسم المستخدم',
    'ar-SA': 'اسم المستخدم',
    'en-US': 'Username'
  },
  'password': {
    'ar-EG': 'كلمة المرور',
    'ar-SA': 'كلمة المرور',
    'en-US': 'Password'
  },
  'enterUsername': {
    'ar-EG': 'أدخل اسم المستخدم',
    'ar-SA': 'أدخل اسم المستخدم',
    'en-US': 'Enter username'
  },
  'enterPassword': {
    'ar-EG': 'أدخل كلمة المرور',
    'ar-SA': 'أدخل كلمة المرور',
    'en-US': 'Enter password'
  },
  'loginAsAdmin': {
    'ar-EG': 'تسجيل الدخول كمشرف',
    'ar-SA': 'تسجيل الدخول كمشرف',
    'en-US': 'Login as Admin'
  },
  'loggingIn': {
    'ar-EG': 'جاري تسجيل الدخول...',
    'ar-SA': 'جاري تسجيل الدخول...',
    'en-US': 'Logging in...'
  },
  'returnToHomepage': {
    'ar-EG': 'العودة إلى الصفحة الرئيسية',
    'ar-SA': 'العودة إلى الصفحة الرئيسية',
    'en-US': 'Return to Homepage'
  },
  'adminDashboard': {
    'ar-EG': 'لوحة تحكم المشرفين',
    'ar-SA': 'لوحة تحكم المشرفين',
    'en-US': 'Admin Dashboard'
  },
  'adminWelcome': {
    'ar-EG': 'مرحبًا بك في لوحة تحكم المشرفين لتطبيق كويك ريسب. هذه المنطقة مخصصة للمشرفين فقط.',
    'ar-SA': 'مرحبًا بك في لوحة تحكم المشرفين لتطبيق كويك ريسب. هذه المنطقة مخصصة للمشرفين فقط.',
    'en-US': 'Welcome to the Admin Dashboard for the Quick Recipe application. This area is reserved for administrators only.'
  },
  'adminCapabilities': {
    'ar-EG': 'يمكنك من خلال هذه اللوحة إدارة المحتوى ومراقبة المنشورات وإدارة المستخدمين والإشراف على جميع أنشطة المنصة.',
    'ar-SA': 'يمكنك من خلال هذه اللوحة إدارة المحتوى ومراقبة المنشورات وإدارة المستخدمين والإشراف على جميع أنشطة المنصة.',
    'en-US': 'Through this dashboard, you can manage content, monitor posts, manage users, and oversee all platform activities.'
  },
  'loginError': {
    'ar-EG': 'فشل تسجيل الدخول',
    'ar-SA': 'فشل تسجيل الدخول',
    'en-US': 'Login Failed'
  },
  'checkCredentials': {
    'ar-EG': 'يرجى التحقق من اسم المستخدم وكلمة المرور',
    'ar-SA': 'يرجى التحقق من اسم المستخدم وكلمة المرور',
    'en-US': 'Please check your username and password'
  },
  'dataError': {
    'ar-EG': 'خطأ في البيانات',
    'ar-SA': 'خطأ في البيانات',
    'en-US': 'Data Error'
  },
  'pleaseEnterCredentials': {
    'ar-EG': 'يرجى إدخال اسم المستخدم وكلمة المرور',
    'ar-SA': 'يرجى إدخال اسم المستخدم وكلمة المرور',
    'en-US': 'Please enter username and password'
  },
  'loginSuccess': {
    'ar-EG': 'تم تسجيل الدخول بنجاح',
    'ar-SA': 'تم تسجيل الدخول بنجاح',
    'en-US': 'Login Successful'
  },
  'welcomeAdmin': {
    'ar-EG': 'مرحباً بك في لوحة تحكم المشرفين',
    'ar-SA': 'مرحباً بك في لوحة تحكم المشرفين',
    'en-US': 'Welcome to the Admin Dashboard'
  },
  'verifying': {
    'ar-EG': 'جاري التحقق...',
    'ar-SA': 'جاري التحقق...',
    'en-US': 'Verifying...'
  },
  'pleaseWait': {
    'ar-EG': 'يرجى الانتظار... جاري التحقق من صلاحيات المشرف',
    'ar-SA': 'يرجى الانتظار... جاري التحقق من صلاحيات المشرف',
    'en-US': 'Please wait... Verifying admin permissions'
  },
  'processingContinues': {
    'ar-EG': '...لا تزال المعالجة جارية',
    'ar-SA': '...لا تزال المعالجة جارية',
    'en-US': '...Processing continues'
  },
  'synchronizingSession': {
    'ar-EG': 'تتم الآن مزامنة جلسة المستخدم. يرجى الانتظار...',
    'ar-SA': 'تتم الآن مزامنة جلسة المستخدم. يرجى الانتظار...',
    'en-US': 'Synchronizing user session. Please wait...'
  },
  'verificationSuccess': {
    'ar-EG': 'تم التحقق بنجاح!',
    'ar-SA': 'تم التحقق بنجاح!',
    'en-US': 'Verification Successful!'
  },
  'redirectingToDashboard': {
    'ar-EG': 'تم التحقق من صلاحيات المشرف. جاري التوجيه إلى لوحة التحكم...',
    'ar-SA': 'تم التحقق من صلاحيات المشرف. جاري التوجيه إلى لوحة التحكم...',
    'en-US': 'Admin permissions verified. Redirecting to dashboard...'
  },
  'verificationFailed': {
    'ar-EG': 'فشل التحقق من صلاحيات المشرف',
    'ar-SA': 'فشل التحقق من صلاحيات المشرف',
    'en-US': 'Admin Verification Failed'
  },
  'verificationError': {
    'ar-EG': 'حدث خطأ أثناء التحقق من صلاحيات المشرف. يرجى المحاولة مرة أخرى.',
    'ar-SA': 'حدث خطأ أثناء التحقق من صلاحيات المشرف. يرجى المحاولة مرة أخرى.',
    'en-US': 'An error occurred while verifying admin permissions. Please try again.'
  },
  // Header
  'appName': {
    'ar-EG': 'وصفات سريعة',
    'ar-SA': 'وصفات سريعة',
    'en-US': 'Fast Recipe'
  },
  'tagline': {
    'ar-EG': 'دوّر على أكلات من المكونات اللي عندك في البيت',
    'ar-SA': 'ابحث عن وصفات من المكونات المتوفرة لديك',
    'en-US': 'Find recipes from ingredients you have at home'
  },
  'searchButton': {
    'ar-EG': 'دوّر',
    'ar-SA': 'ابحث',
    'en-US': 'Search'
  },

  // Search Bar
  'recipeNamePlaceholder': {
    'ar-EG': 'ابحث عن وصفة بالاسم...',
    'ar-SA': 'ابحث عن وصفة بالاسم...',
    'en-US': 'Search for a recipe by name...'
  },
  'or': {
    'ar-EG': 'أو',
    'ar-SA': 'أو',
    'en-US': 'OR'
  },
  'ingredientPlaceholder': {
    'ar-EG': 'اكتب المكون اللي عندك في البيت...',
    'ar-SA': 'اكتب المكون المتوفر لديك...',
    'en-US': 'Enter an ingredient you have...'
  },
  'addIngredient': {
    'ar-EG': 'حطّه',
    'ar-SA': 'أضف',
    'en-US': 'Add'
  },
  'findRecipes': {
    'ar-EG': 'طلّعلي أكلات',
    'ar-SA': 'ابحث عن وصفات',
    'en-US': 'Find Recipes'
  },

  // Ingredients
  'yourIngredients': {
    'ar-EG': 'المكونات عندك',
    'ar-SA': 'المكونات المتوفرة لديك',
    'en-US': 'Your Ingredients'
  },
  'noIngredients': {
    'ar-EG': 'مفيش مكونات لسه. أضف المكونات اللي عندك في البيت',
    'ar-SA': 'لا توجد مكونات بعد. أضف المكونات المتوفرة لديك',
    'en-US': 'No ingredients yet. Add ingredients you have.'
  },
  'clearAll': {
    'ar-EG': 'امسح الكل',
    'ar-SA': 'مسح الكل',
    'en-US': 'Clear All'
  },

  // Recipe Results
  'foundRecipes': {
    'ar-EG': 'لقينا وصفات ليك',
    'ar-SA': 'الوصفات التي تم العثور عليها',
    'en-US': 'Found Recipes'
  },
  'noRecipesFound': {
    'ar-EG': 'مفيش وصفات باالمكونات دي. جرب مكونات تانية!',
    'ar-SA': 'لم يتم العثور على وصفات بهذه المكونات. حاول بمكونات أخرى!',
    'en-US': 'No recipes found with these ingredients. Try different ones!'
  },
  'ingredients': {
    'ar-EG': 'المكونات',
    'ar-SA': 'المكونات',
    'en-US': 'Ingredients'
  },
  'instructions': {
    'ar-EG': 'طريقة التحضير',
    'ar-SA': 'طريقة التحضير',
    'en-US': 'Instructions'
  },
  'watchVideo': {
    'ar-EG': 'شوف الفيديو',
    'ar-SA': 'شاهد الفيديو',
    'en-US': 'Watch Video'
  },

  // Suggested Ingredients
  'suggestedIngredients': {
    'ar-EG': 'مكونات مقترحة',
    'ar-SA': 'مكونات مقترحة',
    'en-US': 'Suggested Ingredients'
  },
  'tryAdding': {
    'ar-EG': 'جرب تضيف',
    'ar-SA': 'جرب إضافة',
    'en-US': 'Try adding'
  },

  // Substitutes
  'ingredientSubstitutes': {
    'ar-EG': 'بدائل المكونات',
    'ar-SA': 'بدائل المكونات',
    'en-US': 'Ingredient Substitutes'
  },
  'enterIngredient': {
    'ar-EG': 'أدخل اسم المكون للبحث عن بدائله...',
    'ar-SA': 'أدخل اسم المكون للبحث عن بدائله...',
    'en-US': 'Enter an ingredient to find substitutes...'
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
    'ar-EG': 'عمليات بحث سابقة',
    'ar-SA': 'عمليات بحث سابقة',
    'en-US': 'Recent Searches'
  },
  'noRecentSearches': {
    'ar-EG': 'لم تقم بأي عمليات بحث بعد',
    'ar-SA': 'لم تقم بأي عمليات بحث بعد',
    'en-US': 'No recent searches yet'
  },
  'substitutesFor': {
    'ar-EG': 'بدائل لـ',
    'ar-SA': 'بدائل لـ',
    'en-US': 'Substitutes for'
  },
  'ratio': {
    'ar-EG': 'النسبة',
    'ar-SA': 'النسبة',
    'en-US': 'Ratio'
  },
  'noSubstitutesFound': {
    'ar-EG': 'لم نجد بدائل لهذا المكون. حاول البحث عن مكون آخر.',
    'ar-SA': 'لم نعثر على بدائل لهذا المكون. حاول البحث عن مكون آخر.',
    'en-US': 'No substitutes found for this ingredient. Try another one.'
  },

  // Footer
  'footerTagline': {
    'ar-EG': 'ابتكر أكلات جديدة من المكونات اللي موجودة في بيتك',
    'ar-SA': 'ابتكر أطباقاً جديدة من المكونات المتوفرة لديك',
    'en-US': 'Create new dishes from ingredients you already have'
  },
  'rateUs': {
    'ar-EG': 'متنساش تديلنا تقييم لو الموقع عجبك',
    'ar-SA': 'لا تنسى تقييمنا إذا أعجبك الموقع',
    'en-US': 'Don\'t forget to rate us if you like the site'
  },
  'madeForYou': {
    'ar-EG': 'عملناه عشانك',
    'ar-SA': 'صنعناه من أجلك',
    'en-US': 'Made for you'
  },
  
  // Admin Post Management
  'moderationSettings': {
    'ar-EG': 'إعدادات المراقبة',
    'ar-SA': 'إعدادات المراقبة',
    'en-US': 'Moderation Settings'
  },
  'moderationSettingsDesc': {
    'ar-EG': 'تخصيص إعدادات الإشراف والمراقبة على المنصة',
    'ar-SA': 'تخصيص إعدادات الإشراف والمراقبة على المنصة',
    'en-US': 'Customize moderation and monitoring settings for the platform'
  },
  'contentModerationSettings': {
    'ar-EG': 'إعدادات مراقبة المحتوى',
    'ar-SA': 'إعدادات مراقبة المحتوى',
    'en-US': 'Content Moderation Settings'
  },
  'aiContentModeration': {
    'ar-EG': 'مراقبة المحتوى بالذكاء الاصطناعي',
    'ar-SA': 'مراقبة المحتوى بالذكاء الاصطناعي',
    'en-US': 'AI Content Moderation'
  },
  'aiContentModerationDesc': {
    'ar-EG': 'فحص المنشورات والتعليقات تلقائيًا باستخدام Gemini AI',
    'ar-SA': 'فحص المنشورات والتعليقات تلقائيًا باستخدام Gemini AI',
    'en-US': 'Automatically scan posts and comments using Gemini AI'
  },
  'autoDeletePosts': {
    'ar-EG': 'الحذف التلقائي للمنشورات',
    'ar-SA': 'الحذف التلقائي للمنشورات',
    'en-US': 'Auto-Delete Posts'
  },
  'autoDeletePostsDesc': {
    'ar-EG': 'حذف المنشورات تلقائيًا بعد وصول عدد البلاغات إلى 50',
    'ar-SA': 'حذف المنشورات تلقائيًا بعد وصول عدد البلاغات إلى 50',
    'en-US': 'Automatically delete posts after reaching 50 reports'
  },
  'notificationSettings': {
    'ar-EG': 'إعدادات الإشعارات',
    'ar-SA': 'إعدادات الإشعارات',
    'en-US': 'Notification Settings'
  },
  'discordNotifications': {
    'ar-EG': 'إشعارات Discord',
    'ar-SA': 'إشعارات Discord',
    'en-US': 'Discord Notifications'
  },
  'discordNotificationsDesc': {
    'ar-EG': 'إرسال إشعارات عن البلاغات الجديدة إلى قناة Discord',
    'ar-SA': 'إرسال إشعارات عن البلاغات الجديدة إلى قناة Discord',
    'en-US': 'Send notifications about new reports to Discord channel'
  },
  'emailNotifications': {
    'ar-EG': 'إشعارات البريد الإلكتروني',
    'ar-SA': 'إشعارات البريد الإلكتروني',
    'en-US': 'Email Notifications'
  },
  'emailNotificationsDesc': {
    'ar-EG': 'إرسال ملخص يومي بالنشاط إلى البريد الإلكتروني للمشرفين',
    'ar-SA': 'إرسال ملخص يومي بالنشاط إلى البريد الإلكتروني للمشرفين',
    'en-US': 'Send daily activity summary to admins\' email'
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
  'postsDeletedSuccess': {
    'ar-EG': 'تم حذف {count} منشور بنجاح من منصة كويك ريسب',
    'ar-SA': 'تم حذف {count} منشور بنجاح من منصة كويك ريسب',
    'en-US': 'Successfully deleted {count} posts from the Quick Recipe platform'
  },
  'deletionFailed': {
    'ar-EG': 'فشل في حذف جميع المنشورات',
    'ar-SA': 'فشل في حذف جميع المنشورات',
    'en-US': 'Failed to delete all posts'
  },
  
  // Admin Dashboard UI Elements
  'posts': {
    'ar-EG': 'المنشورات',
    'ar-SA': 'المنشورات',
    'en-US': 'Posts'
  },
  'communityPosts': {
    'ar-EG': 'منشور في المجتمع',
    'ar-SA': 'منشور في المجتمع',
    'en-US': 'Community Posts'
  },
  'users': {
    'ar-EG': 'المستخدمين',
    'ar-SA': 'المستخدمين',
    'en-US': 'Users'
  },
  'newUsersThisWeek': {
    'ar-EG': 'مستخدم جديد هذا الأسبوع',
    'ar-SA': 'مستخدم جديد هذا الأسبوع',
    'en-US': 'new users this week'
  },
  'reportsHeader': {
    'ar-EG': 'البلاغات',
    'ar-SA': 'البلاغات',
    'en-US': 'Reports'
  },
  'pendingReports': {
    'ar-EG': 'بلاغ في انتظار المراجعة',
    'ar-SA': 'بلاغ في انتظار المراجعة',
    'en-US': 'reports pending review'
  },
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
  'latestPosts': {
    'ar-EG': 'آخر المنشورات',
    'ar-SA': 'آخر المنشورات',
    'en-US': 'Latest Posts'
  },
  'latestPostsDesc': {
    'ar-EG': 'آخر المنشورات المضافة إلى منصة كويك ريسب',
    'ar-SA': 'آخر المنشورات المضافة إلى منصة كويك ريسب',
    'en-US': 'Latest posts added to the Quick Recipe platform'
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
  'viewAllPosts': {
    'ar-EG': 'عرض جميع المنشورات',
    'ar-SA': 'عرض جميع المنشورات',
    'en-US': 'View All Posts'
  },
  'activityStats': {
    'ar-EG': 'إحصائيات النشاط',
    'ar-SA': 'إحصائيات النشاط',
    'en-US': 'Activity Statistics'
  },
  'activityStatsDesc': {
    'ar-EG': 'نشاط المستخدمين والمنشورات خلال الأسبوع الماضي',
    'ar-SA': 'نشاط المستخدمين والمنشورات خلال الأسبوع الماضي',
    'en-US': 'User and post activity during the past week'
  },
  'activeUsersRate': {
    'ar-EG': 'نسبة المستخدمين النشطين',
    'ar-SA': 'نسبة المستخدمين النشطين',
    'en-US': 'Active Users Rate'
  },
  'activeUsersPercentage': {
    'ar-EG': 'نسبة المستخدمين النشطين',
    'ar-SA': 'نسبة المستخدمين النشطين',
    'en-US': 'Active Users Percentage'
  },
  'resolvedReportsRate': {
    'ar-EG': 'نسبة البلاغات المعالجة',
    'ar-SA': 'نسبة البلاغات المعالجة',
    'en-US': 'Resolved Reports Rate'
  },
  'usageTrends': {
    'ar-EG': 'اتجاهات الاستخدام',
    'ar-SA': 'اتجاهات الاستخدام',
    'en-US': 'Usage Trends'
  },
  'usageTrendsDesc': {
    'ar-EG': 'شهدت المنصة زيادة بنسبة 25% في عدد المنشورات الجديدة خلال الأسبوع الماضي.',
    'ar-SA': 'شهدت المنصة زيادة بنسبة 25% في عدد المنشورات الجديدة خلال الأسبوع الماضي.',
    'en-US': 'The platform saw a 25% increase in new posts during the past week.'
  },
  'reportedPosts': {
    'ar-EG': 'البلاغات والمنشورات المبلغ عنها',
    'ar-SA': 'البلاغات والمنشورات المبلغ عنها',
    'en-US': 'Reports and Reported Posts'
  },
  'reportedPostsDesc': {
    'ar-EG': 'المنشورات التي قام المستخدمون بالإبلاغ عنها',
    'ar-SA': 'المنشورات التي قام المستخدمون بالإبلاغ عنها',
    'en-US': 'Posts that users have reported'
  },
  'refresh': {
    'ar-EG': 'تحديث',
    'ar-SA': 'تحديث',
    'en-US': 'Refresh'
  },
  'loadingReports': {
    'ar-EG': 'جاري تحميل البلاغات...',
    'ar-SA': 'جاري تحميل البلاغات...',
    'en-US': 'Loading reports...'
  },
  'noReports': {
    'ar-EG': 'لا توجد بلاغات حتى الآن',
    'ar-SA': 'لا توجد بلاغات حتى الآن',
    'en-US': 'No reports yet'
  },
  'report': {
    'ar-EG': 'بلاغ',
    'ar-SA': 'بلاغ',
    'en-US': 'report'
  },
  'reports': {
    'ar-EG': 'بلاغات',
    'ar-SA': 'بلاغات',
    'en-US': 'reports'
  },
  'pendingReview': {
    'ar-EG': 'بانتظار المراجعة',
    'ar-SA': 'بانتظار المراجعة',
    'en-US': 'Pending Review'
  },
  'maxReportsReached': {
    'ar-EG': 'بلغ الحد الأقصى',
    'ar-SA': 'بلغ الحد الأقصى',
    'en-US': 'Maximum Reports Reached'
  },
  'postDate': {
    'ar-EG': 'تاريخ المنشور',
    'ar-SA': 'تاريخ المنشور',
    'en-US': 'Post Date'
  },
  'alert': {
    'ar-EG': 'تنبيه',
    'ar-SA': 'تنبيه',
    'en-US': 'Alert'
  },
  'postReportsWarning': {
    'ar-EG': 'هذا المنشور بلغ حد البلاغات (50 بلاغ) ويجب مراجعته أو إزالته على الفور.',
    'ar-SA': 'هذا المنشور بلغ حد البلاغات (50 بلاغ) ويجب مراجعته أو إزالته على الفور.',
    'en-US': 'This post has reached the report threshold (50 reports) and should be reviewed or removed immediately.'
  },
  'deletePost': {
    'ar-EG': 'حذف المنشور',
    'ar-SA': 'حذف المنشور',
    'en-US': 'Delete Post'
  },
  'viewPost': {
    'ar-EG': 'عرض المنشور',
    'ar-SA': 'عرض المنشور',
    'en-US': 'View Post'
  },
  'aiModeration': {
    'ar-EG': 'مراقبة المحتوى بالذكاء الاصطناعي',
    'ar-SA': 'مراقبة المحتوى بالذكاء الاصطناعي',
    'en-US': 'AI Content Moderation'
  },
  'enableAiModeration': {
    'ar-EG': 'تفعيل الفحص التلقائي للمنشورات الجديدة',
    'ar-SA': 'تفعيل الفحص التلقائي للمنشورات الجديدة',
    'en-US': 'Enable automatic scanning of new posts'
  },
  'dangerZone': {
    'ar-EG': 'منطقة الخطر',
    'ar-SA': 'منطقة الخطر',
    'en-US': 'Danger Zone'
  },
  'deleteAllPostsBtn': {
    'ar-EG': 'حذف جميع المنشورات',
    'ar-SA': 'حذف جميع المنشورات',
    'en-US': 'Delete All Posts'
  },
  'warningDeleteAllPosts': {
    'ar-EG': 'تحذير: هذا الإجراء سيحذف <strong>جميع المنشورات</strong> من منصة كويك ريسب بشكل نهائي. لا يمكن التراجع عن هذا الإجراء.',
    'ar-SA': 'تحذير: هذا الإجراء سيحذف <strong>جميع المنشورات</strong> من منصة كويك ريسب بشكل نهائي. لا يمكن التراجع عن هذا الإجراء.',
    'en-US': 'Warning: This action will delete <strong>all posts</strong> from the Quick Recipe platform permanently. This action cannot be undone.'
  },
  'permanentAction': {
    'ar-EG': 'إجراء لا يمكن التراجع عنه',
    'ar-SA': 'إجراء لا يمكن التراجع عنه',
    'en-US': 'Irreversible Action'
  },
  'deleteAllPostsConfirmationDesc': {
    'ar-EG': 'هذا الإجراء سيحذف جميع المنشورات المجتمعية من منصة كويك ريسب بشكل نهائي.',
    'ar-SA': 'هذا الإجراء سيحذف جميع المنشورات المجتمعية من منصة كويك ريسب بشكل نهائي.',
    'en-US': 'This action will permanently delete all community posts from the Quick Recipe platform.'
  },
  'cannotUndoAction': {
    'ar-EG': 'لا يمكن استعادة المنشورات بعد حذفها. سيتم حذف جميع المنشورات وتعليقاتها والبلاغات المرتبطة بها.',
    'ar-SA': 'لا يمكن استعادة المنشورات بعد حذفها. سيتم حذف جميع المنشورات وتعليقاتها والبلاغات المرتبطة بها.',
    'en-US': 'Posts cannot be recovered after deletion. All posts, their comments, and associated reports will be deleted.'
  },
  'understandIrreversible': {
    'ar-EG': 'أنا أفهم أن هذا الإجراء نهائي ولا يمكن التراجع عنه',
    'ar-SA': 'أنا أفهم أن هذا الإجراء نهائي ولا يمكن التراجع عنه',
    'en-US': 'I understand that this action is final and cannot be undone'
  },
  'cancel': {
    'ar-EG': 'إلغاء',
    'ar-SA': 'إلغاء',
    'en-US': 'Cancel'
  },
  'confirmationRequired': {
    'ar-EG': 'تأكيد مطلوب',
    'ar-SA': 'تأكيد مطلوب',
    'en-US': 'Confirmation Required'
  },
  'pleaseConfirmAction': {
    'ar-EG': 'يرجى تأكيد فهمك لعواقب هذا الإجراء',
    'ar-SA': 'يرجى تأكيد فهمك لعواقب هذا الإجراء',
    'en-US': 'Please confirm that you understand the consequences of this action'
  },
  'deletingAllPosts': {
    'ar-EG': 'جاري حذف جميع المنشورات...',
    'ar-SA': 'جاري حذف جميع المنشورات...',
    'en-US': 'Deleting all posts...'
  },
  'confirmDeleteAllPosts': {
    'ar-EG': 'تأكيد حذف جميع المنشورات',
    'ar-SA': 'تأكيد حذف جميع المنشورات',
    'en-US': 'Confirm Delete All Posts'
  },
  'confirmDeletePost': {
    'ar-EG': 'تأكيد حذف المنشور',
    'ar-SA': 'تأكيد حذف المنشور',
    'en-US': 'Confirm Post Deletion'
  },
  'confirmDeletePostDesc': {
    'ar-EG': 'هل أنت متأكد من رغبتك في حذف المنشور "{title}"؟ هذا الإجراء نهائي ولا يمكن التراجع عنه.',
    'ar-SA': 'هل أنت متأكد من رغبتك في حذف المنشور "{title}"؟ هذا الإجراء نهائي ولا يمكن التراجع عنه.',
    'en-US': 'Are you sure you want to delete the post "{title}"? This action is final and cannot be undone.'
  },
  'deleting': {
    'ar-EG': 'جاري الحذف...',
    'ar-SA': 'جاري الحذف...',
    'en-US': 'Deleting...'
  },
  'confirmDelete': {
    'ar-EG': 'تأكيد الحذف',
    'ar-SA': 'تأكيد الحذف',
    'en-US': 'Confirm Delete'
  },
  'postDeleted': {
    'ar-EG': 'تم حذف المنشور',
    'ar-SA': 'تم حذف المنشور',
    'en-US': 'Post Deleted'
  },
  'postDeletedSuccess': {
    'ar-EG': 'تم حذف المنشور بنجاح وإرسال إشعار للمشرفين',
    'ar-SA': 'تم حذف المنشور بنجاح وإرسال إشعار للمشرفين',
    'en-US': 'Post successfully deleted and notification sent to admins'
  },
  'postDeletionFailed': {
    'ar-EG': 'فشل في حذف المنشور',
    'ar-SA': 'فشل في حذف المنشور',
    'en-US': 'Failed to delete post'
  },
  'untitledPost': {
    'ar-EG': 'منشور بدون عنوان',
    'ar-SA': 'منشور بدون عنوان',
    'en-US': 'Untitled Post'
  }
};

export default translations;