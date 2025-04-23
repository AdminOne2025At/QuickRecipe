import { Language } from '@/components/LanguageSelector';

export const translations: Record<string, Record<Language, string>> = {
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
  }
};

export default translations;