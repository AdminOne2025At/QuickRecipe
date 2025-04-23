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
  }
};

export default translations;