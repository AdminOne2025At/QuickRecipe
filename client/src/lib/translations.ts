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
  
  // Post Management Buttons and Dialogs
  'deletePost': {
    'ar-EG': 'حذف المنشور',
    'ar-SA': 'حذف المنشور',
    'en-US': 'Delete Post'
  },
  'deleteAllPostsBtn': {
    'ar-EG': 'حذف جميع المنشورات',
    'ar-SA': 'حذف جميع المنشورات',
    'en-US': 'Delete All Posts'
  },
  'confirmDeletePost': {
    'ar-EG': 'تأكيد حذف المنشور',
    'ar-SA': 'تأكيد حذف المنشور',
    'en-US': 'Confirm Post Deletion'
  },
  'confirmDeleteAllPosts': {
    'ar-EG': 'تأكيد حذف جميع المنشورات',
    'ar-SA': 'تأكيد حذف جميع المنشورات',
    'en-US': 'Confirm Deleting All Posts'
  },
  'confirmDeletePostMessage': {
    'ar-EG': 'هل أنت متأكد من رغبتك في حذف المنشور {postTitle}؟',
    'ar-SA': 'هل أنت متأكد من رغبتك في حذف المنشور {postTitle}؟',
    'en-US': 'Are you sure you want to delete the post {postTitle}?'
  },
  'deleteAllPostsWarningText': {
    'ar-EG': 'أنت على وشك حذف جميع منشورات المجتمع من منصة كويك ريسب!',
    'ar-SA': 'أنت على وشك حذف جميع منشورات المجتمع من منصة كويك ريسب!',
    'en-US': 'You are about to delete ALL community posts from the Quick Recipe platform!'
  },
  'deleteAllPostsDetails': {
    'ar-EG': 'سيؤدي هذا إلى حذف جميع منشورات المستخدمين وتعليقاتهم والمحتوى المرتبط بها بشكل دائم.',
    'ar-SA': 'سيؤدي هذا إلى حذف جميع منشورات المستخدمين وتعليقاتهم والمحتوى المرتبط بها بشكل دائم.',
    'en-US': 'This will permanently delete all user posts, comments, and associated content.'
  },
  'irreversibleAction': {
    'ar-EG': 'إجراء لا يمكن التراجع عنه',
    'ar-SA': 'إجراء لا يمكن التراجع عنه',
    'en-US': 'Irreversible Action'
  },
  'confirmIrreversibleAction': {
    'ar-EG': 'أؤكد فهمي أن هذا الإجراء لا يمكن التراجع عنه',
    'ar-SA': 'أؤكد فهمي أن هذا الإجراء لا يمكن التراجع عنه',
    'en-US': 'I confirm that I understand this action cannot be undone'
  },
  'confirmationRequired': {
    'ar-EG': 'تأكيد مطلوب',
    'ar-SA': 'تأكيد مطلوب',
    'en-US': 'Confirmation Required'
  },
  'confirmUnderstanding': {
    'ar-EG': 'يرجى تأكيد فهمك لعواقب هذا الإجراء',
    'ar-SA': 'يرجى تأكيد فهمك لعواقب هذا الإجراء',
    'en-US': 'Please confirm that you understand the consequences of this action'
  },
  'cancel': {
    'ar-EG': 'إلغاء',
    'ar-SA': 'إلغاء',
    'en-US': 'Cancel'
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
  'confirmDelete': {
    'ar-EG': 'تأكيد الحذف',
    'ar-SA': 'تأكيد الحذف',
    'en-US': 'Confirm Delete'
  },
  
  // Success and Error Messages
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
    'ar-EG': 'تم حذف {count} منشور بنجاح من منصة كويك ريسب',
    'ar-SA': 'تم حذف {count} منشور بنجاح من منصة كويك ريسب',
    'en-US': 'Successfully deleted {count} posts from the Quick Recipe platform'
  },
  'allPostsDeleteFailed': {
    'ar-EG': 'فشل في حذف جميع المنشورات',
    'ar-SA': 'فشل في حذف جميع المنشورات',
    'en-US': 'Failed to delete all posts'
  },
  
  // Admin Dashboard UI Elements
  'adminInfo': {
    'ar-EG': 'معلومات المشرف',
    'ar-SA': 'معلومات المشرف',
    'en-US': 'Admin Information'
  },
  'admin': {
    'ar-EG': 'مشرف',
    'ar-SA': 'مشرف',
    'en-US': 'Admin'
  },
  'adminStatus': {
    'ar-EG': 'حالة المشرف',
    'ar-SA': 'حالة المشرف',
    'en-US': 'Admin Status'
  },
  'adminDashboard': {
    'ar-EG': 'لوحة تحكم المشرفين',
    'ar-SA': 'لوحة تحكم المشرفين',
    'en-US': 'Admin Dashboard'
  },
  'returnToHomepage': {
    'ar-EG': 'العودة إلى الصفحة الرئيسية',
    'ar-SA': 'العودة إلى الصفحة الرئيسية',
    'en-US': 'Return to Homepage'
  },
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
  'usageStatistics': {
    'ar-EG': 'إحصائيات الاستخدام',
    'ar-SA': 'إحصائيات الاستخدام',
    'en-US': 'Usage Statistics'
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
    'ar-EG': 'نشاط المستخدمين والمنشورات خلال الأسبوع الماضي',
    'ar-SA': 'نشاط المستخدمين والمنشورات خلال الأسبوع الماضي',
    'en-US': 'User and post activity during the past week'
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
  'reportsAndReportedPosts': {
    'ar-EG': 'البلاغات والمنشورات المبلغ عنها',
    'ar-SA': 'البلاغات والمنشورات المبلغ عنها',
    'en-US': 'Reports and Reported Posts'
  },
  'postsReportedByUsers': {
    'ar-EG': 'المنشورات المبلغ عنها من قبل المستخدمين',
    'ar-SA': 'المنشورات المبلغ عنها من قبل المستخدمين',
    'en-US': 'Posts reported by users'
  },
  'report': {
    'ar-EG': 'بلاغ',
    'ar-SA': 'بلاغ',
    'en-US': 'report'
  },
  'pendingReview': {
    'ar-EG': 'في انتظار المراجعة',
    'ar-SA': 'في انتظار المراجعة',
    'en-US': 'pending review'
  },
  'reachedMaximum': {
    'ar-EG': 'بلغ الحد الأقصى',
    'ar-SA': 'بلغ الحد الأقصى',
    'en-US': 'reached maximum'
  },
  'postReachedMaximumReports': {
    'ar-EG': 'هذا المنشور بلغ حد البلاغات (50 بلاغ) ويجب مراجعته أو إزالته على الفور',
    'ar-SA': 'هذا المنشور بلغ حد البلاغات (50 بلاغ) ويجب مراجعته أو إزالته على الفور',
    'en-US': 'This post has reached the report threshold (50 reports) and should be reviewed or removed immediately'
  },
  'dangerZone': {
    'ar-EG': 'منطقة الخطر',
    'ar-SA': 'منطقة الخطر',
    'en-US': 'Danger Zone'
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
    'ar-EG': 'تحذير: هذا الإجراء سيحذف جميع منشورات المجتمع بشكل دائم. لا يمكن التراجع عن هذا الإجراء.',
    'ar-SA': 'تحذير: هذا الإجراء سيحذف جميع منشورات المجتمع بشكل دائم. لا يمكن التراجع عن هذا الإجراء.',
    'en-US': 'Warning: This action will permanently delete all community posts. This action cannot be undone.'
  },
  'adminTools': {
    'ar-EG': 'أدوات المشرف',
    'ar-SA': 'أدوات المشرف',
    'en-US': 'Admin Tools'
  },
  'currentUserInfo': {
    'ar-EG': 'معلومات المستخدم الحالي',
    'ar-SA': 'معلومات المستخدم الحالي',
    'en-US': 'Current User Information'
  },
  'newUsersThisWeek': {
    'ar-EG': 'مستخدم جديد هذا الأسبوع',
    'ar-SA': 'مستخدم جديد هذا الأسبوع',
    'en-US': 'new users this week'
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
    'en-US': 'user'
  },
  'viewAllPosts': {
    'ar-EG': 'عرض جميع المنشورات',
    'ar-SA': 'عرض جميع المنشورات',
    'en-US': 'View all posts'
  },
  'noReportsYet': {
    'ar-EG': 'لا توجد بلاغات حتى الآن',
    'ar-SA': 'لا توجد بلاغات حتى الآن',
    'en-US': 'No reports yet'
  },
  'moderationSettings': {
    'ar-EG': 'إعدادات الإشراف',
    'ar-SA': 'إعدادات الإشراف',
    'en-US': 'Moderation Settings'
  },
  'moderationSettingsDesc': {
    'ar-EG': 'إدارة كيفية تعامل النظام مع المحتوى والبلاغات',
    'ar-SA': 'إدارة كيفية تعامل النظام مع المحتوى والبلاغات',
    'en-US': 'Manage how the system handles content and reports'
  },
  'contentModerationSettings': {
    'ar-EG': 'إعدادات مراقبة المحتوى',
    'ar-SA': 'إعدادات مراقبة المحتوى',
    'en-US': 'Content Moderation Settings'
  },
  'aiContentModerationDesc': {
    'ar-EG': 'استخدام الذكاء الاصطناعي لاكتشاف المحتوى غير اللائق وتصفيته تلقائياً',
    'ar-SA': 'استخدام الذكاء الاصطناعي لاكتشاف المحتوى غير اللائق وتصفيته تلقائياً',
    'en-US': 'Use AI to detect and filter inappropriate content automatically'
  },
  'noTitlePost': {
    'ar-EG': 'منشور بدون عنوان',
    'ar-SA': 'منشور بدون عنوان',
    'en-US': 'Post without title'
  },
  'systemAdmin': {
    'ar-EG': 'مشرف النظام',
    'ar-SA': 'مشرف النظام',
    'en-US': 'System Admin'
  },
  'failedToFetchReports': {
    'ar-EG': 'فشل في استرجاع البلاغات',
    'ar-SA': 'فشل في استرجاع البلاغات',
    'en-US': 'Failed to fetch reports'
  },
  
  // Ingredients Component
  'yourIngredients': {
    'ar-EG': 'المكونات المتاحة لديك',
    'ar-SA': 'المكونات المتاحة لديك',
    'en-US': 'Your Available Ingredients'
  },
  'addIngredient': {
    'ar-EG': 'إضافة مكون',
    'ar-SA': 'إضافة مكون',
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
    'ar-EG': 'أدخل اسم المكون...',
    'ar-SA': 'أدخل اسم المكون...',
    'en-US': 'Enter ingredient name...'
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
    'ar-EG': 'لم يتم العثور على بدائل لهذا المكون',
    'ar-SA': 'لم يتم العثور على بدائل لهذا المكون',
    'en-US': 'No substitutes found for this ingredient'
  },
  
  // Recipe Results Component
  'instructions': {
    'ar-EG': 'طريقة الشغل',
    'ar-SA': 'طريقة الشغل',
    'en-US': 'Instructions'
  },
  'watchVideo': {
    'ar-EG': 'كمان ممكن تتفرج على الفيديو',
    'ar-SA': 'كمان ممكن تتفرج على الفيديو',
    'en-US': 'You can also watch the video'
  },
  
  // Suggested Ingredients Component
  'suggestedIngredients': {
    'ar-EG': 'مكونات مقترحة',
    'ar-SA': 'مكونات مقترحة',
    'en-US': 'Suggested Ingredients'
  },
  
  // Admin Login Page
  'loginSuccess': {
    'ar-EG': 'تم تسجيل الدخول بنجاح',
    'ar-SA': 'تم تسجيل الدخول بنجاح',
    'en-US': 'Login Successful'
  },
  'welcomeAdmin': {
    'ar-EG': 'مرحبًا بك في لوحة تحكم المشرف',
    'ar-SA': 'مرحبًا بك في لوحة تحكم المشرف',
    'en-US': 'Welcome to the admin dashboard'
  },
  'verifying': {
    'ar-EG': 'جاري التحقق',
    'ar-SA': 'جاري التحقق',
    'en-US': 'Verifying'
  },
  'pleaseWait': {
    'ar-EG': 'الرجاء الانتظار...',
    'ar-SA': 'الرجاء الانتظار...',
    'en-US': 'Please wait...'
  },
  'processingContinues': {
    'ar-EG': 'المعالجة مستمرة',
    'ar-SA': 'المعالجة مستمرة',
    'en-US': 'Processing Continues'
  },
  'synchronizingSession': {
    'ar-EG': 'مزامنة جلسة المشرف...',
    'ar-SA': 'مزامنة جلسة المشرف...',
    'en-US': 'Synchronizing admin session...'
  },
  'verificationSuccess': {
    'ar-EG': 'تم التحقق بنجاح',
    'ar-SA': 'تم التحقق بنجاح',
    'en-US': 'Verification Successful'
  },
  'redirectingToDashboard': {
    'ar-EG': 'جارٍ التوجيه إلى لوحة المشرف...',
    'ar-SA': 'جارٍ التوجيه إلى لوحة المشرف...',
    'en-US': 'Redirecting to admin dashboard...'
  },
  'verificationFailed': {
    'ar-EG': 'فشل التحقق',
    'ar-SA': 'فشل التحقق',
    'en-US': 'Verification Failed'
  },
  'verificationError': {
    'ar-EG': 'حدث خطأ أثناء التحقق من صلاحيات المشرف',
    'ar-SA': 'حدث خطأ أثناء التحقق من صلاحيات المشرف',
    'en-US': 'An error occurred while verifying admin credentials'
  },
  'loginError': {
    'ar-EG': 'خطأ في تسجيل الدخول',
    'ar-SA': 'خطأ في تسجيل الدخول',
    'en-US': 'Login Error'
  },
  'checkCredentials': {
    'ar-EG': 'تحقق من اسم المستخدم وكلمة المرور وحاول مرة أخرى',
    'ar-SA': 'تحقق من اسم المستخدم وكلمة المرور وحاول مرة أخرى',
    'en-US': 'Check your username and password and try again'
  },
  'dataError': {
    'ar-EG': 'خطأ في البيانات',
    'ar-SA': 'خطأ في البيانات',
    'en-US': 'Data Error'
  },
  'pleaseEnterCredentials': {
    'ar-EG': 'الرجاء إدخال اسم المستخدم وكلمة المرور',
    'ar-SA': 'الرجاء إدخال اسم المستخدم وكلمة المرور',
    'en-US': 'Please enter your username and password'
  },
  'adminEntrance': {
    'ar-EG': 'مدخل المشرفين',
    'ar-SA': 'مدخل المشرفين',
    'en-US': 'Admin Entrance'
  },
  'adminPanelOnly': {
    'ar-EG': 'هذه اللوحة مخصصة للمشرفين فقط',
    'ar-SA': 'هذه اللوحة مخصصة للمشرفين فقط',
    'en-US': 'This panel is for administrators only'
  },
  'username': {
    'ar-EG': 'اسم المستخدم',
    'ar-SA': 'اسم المستخدم',
    'en-US': 'Username'
  },
  'enterUsername': {
    'ar-EG': 'أدخل اسم المستخدم',
    'ar-SA': 'أدخل اسم المستخدم',
    'en-US': 'Enter username'
  },
  'password': {
    'ar-EG': 'كلمة المرور',
    'ar-SA': 'كلمة المرور',
    'en-US': 'Password'
  },
  'enterPassword': {
    'ar-EG': 'أدخل كلمة المرور',
    'ar-SA': 'أدخل كلمة المرور',
    'en-US': 'Enter password'
  },
  'loggingIn': {
    'ar-EG': 'جاري تسجيل الدخول...',
    'ar-SA': 'جاري تسجيل الدخول...',
    'en-US': 'Logging in...'
  },
  'loginAsAdmin': {
    'ar-EG': 'تسجيل الدخول كمشرف',
    'ar-SA': 'تسجيل الدخول كمشرف',
    'en-US': 'Login as Admin'
  },
  'adminWelcome': {
    'ar-EG': 'مرحبًا بك في نظام إدارة كويك ريسب',
    'ar-SA': 'مرحبًا بك في نظام إدارة كويك ريسب',
    'en-US': 'Welcome to Quick Recipe management system'
  },
  'adminCapabilities': {
    'ar-EG': 'هنا يمكنك إدارة المحتوى ومراقبة المنشورات والإشراف على المنصة',
    'ar-SA': 'هنا يمكنك إدارة المحتوى ومراقبة المنشورات والإشراف على المنصة',
    'en-US': 'Here you can manage content, monitor posts, and supervise the platform'
  },
  
  // Admin Dashboard - Moderation Settings
  'aiContentModeration': {
    'ar-EG': 'مراقبة المحتوى بالذكاء الاصطناعي',
    'ar-SA': 'مراقبة المحتوى بالذكاء الاصطناعي',
    'en-US': 'AI Content Moderation'
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