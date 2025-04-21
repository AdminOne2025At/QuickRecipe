/**
 * خدمة إشعارات Discord لإرسال تقارير المحتوى المسيء وإشعارات تسجيل الدخول
 * تستخدم Discord Webhook لإرسال رسائل إلى قناة محددة
 */

import fetch from 'node-fetch';
import { CommunityPost, PostReport, User, postReports } from '@shared/schema';
import { storage } from '../storage';
import { db } from '../db';
import { eq } from 'drizzle-orm';

// واجهة لبيانات تسجيل الدخول
interface LoginPayload {
  userId?: number;
  username: string;
  email?: string;
  loginMethod: 'google' | 'admin' | 'guest';
  loginTime: Date;
  userAgent?: string;
  ipAddress?: string;
  isAdmin?: boolean;
  isLogout?: boolean; // إضافة علامة لتحديد ما إذا كان تسجيل خروج
}

// واجهة لبيانات الإبلاغ الكاملة مع معلومات المستخدم والمنشور
interface ReportDetailsPayload {
  report: PostReport;
  post: CommunityPost;
  reporter: Partial<User>;
  postCreator: Partial<User>;
}

// واجهة لبيانات الإزالة التلقائية
interface AutoRemovalPayload {
  postId: number;
  reportCount: number;
  reason: string;
  post?: CommunityPost;
  postCreator?: Partial<User>;
}

/**
 * إرسال إشعار Discord عن إبلاغ منشور
 * 
 * @param reportId معرف البلاغ
 * @returns وعد بنتيجة العملية
 */
export async function sendPostReportToDiscord(reportId: number): Promise<boolean> {
  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("Discord webhook URL is not configured.");
      return false;
    }

    // الحصول على معلومات البلاغ
    const reportData = await getReportDetails(reportId);
    if (!reportData) {
      console.error(`Failed to get report details for ID: ${reportId}`);
      return false;
    }

    // إنشاء رسالة Discord Embed
    const embed = createDiscordEmbed(reportData);

    // إرسال البيانات إلى Discord
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: "⚠️ **تم الإبلاغ عن منشور جديد** ⚠️",
        embeds: [embed]
      }),
    });

    if (!response.ok) {
      console.error(`Discord webhook error: ${response.status} ${response.statusText}`);
      const responseText = await response.text();
      console.error(`Discord response: ${responseText}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending Discord notification:', error);
    return false;
  }
}

/**
 * الحصول على التفاصيل الكاملة للبلاغ
 * 
 * @param reportId معرف البلاغ
 * @returns وعد بكائن يحتوي على كافة المعلومات
 */
async function getReportDetails(reportId: number): Promise<ReportDetailsPayload | null> {
  try {
    console.log(`Getting report details for ID: ${reportId}`);
    
    // الحصول على تفاصيل البلاغ مباشرة
    const report = await db
      .select()
      .from(postReports)
      .where(eq(postReports.id, reportId))
      .limit(1)
      .then(rows => rows[0]);
    
    if (!report) {
      console.error(`No report found with ID: ${reportId}`);
      return null;
    }
    
    console.log(`Found report: ${JSON.stringify(report)}`);
    
    // الحصول على بيانات المنشور
    const post = await storage.getCommunityPost(report.postId);
    if (!post) {
      console.error(`No post found with ID: ${report.postId}`);
      return null;
    }
    
    // الحصول على بيانات المبلغ
    const reporter = await storage.getUser(report.userId);
    
    // الحصول على بيانات منشئ المنشور
    const postCreator = await storage.getUser(post.userId);
    
    return {
      report,
      post,
      reporter: reporter || { username: 'مستخدم غير معروف' },
      postCreator: postCreator || { username: 'مستخدم غير معروف' }
    };
  } catch (error) {
    console.error('Error getting report details:', error);
    return null;
  }
}

/**
 * إنشاء Embed لرسالة Discord
 * 
 * @param data كائن بيانات البلاغ
 * @returns كائن Embed لـ Discord
 */
function createDiscordEmbed(data: ReportDetailsPayload): any {
  const { report, post, reporter, postCreator } = data;
  
  // تنسيق التاريخ
  const reportDate = new Date(report.createdAt || new Date()).toLocaleString('ar-EG');
  
  // تقصير محتوى المنشور إذا كان طويلاً
  const truncatedContent = post.content && post.content.length > 300 
    ? post.content.substring(0, 297) + '...' 
    : (post.content || 'بدون محتوى');

  // إنشاء Embed
  return {
    title: `الإبلاغ عن منشور: ${post.title || 'بدون عنوان'}`,
    color: 0xFF0000, // أحمر للإشارة إلى مشكلة
    timestamp: new Date().toISOString(),
    fields: [
      {
        name: '📝 البلاغ',
        value: report.reason || 'لم يتم تحديد سبب',
        inline: false
      },
      {
        name: '🧾 محتوى المنشور',
        value: truncatedContent,
        inline: false
      },
      {
        name: '👤 معلومات المبلغ',
        value: `**الاسم**: ${reporter.username || 'غير معروف'}\n**المعرف**: ${reporter.id || 'غير متوفر'}`,
        inline: true
      },
      {
        name: '👤 منشئ المحتوى',
        value: `**الاسم**: ${postCreator.username || 'غير معروف'}\n**المعرف**: ${postCreator.id || 'غير متوفر'}`,
        inline: true
      },
      {
        name: '📊 الإحصائيات',
        value: `**عدد البلاغات**: ${post.reports || 1}\n**تاريخ الإبلاغ**: ${reportDate}`,
        inline: false
      },
      {
        name: '🔗 روابط',
        value: `[عرض المنشور](https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/community-posts/${post.id})`,
        inline: false
      }
    ],
    footer: {
      text: "نظام إدارة المحتوى - كويك ريسب"
    }
  };
}

/**
 * إرسال إشعار عند تسجيل دخول مستخدم
 * 
 * @param loginData بيانات تسجيل الدخول
 * @returns وعد بنتيجة العملية
 */
export async function sendLoginNotificationToDiscord(loginData: LoginPayload): Promise<boolean> {
  try {
    // استخدام webhook منفصل لإشعارات تسجيل الدخول إذا كان متوفراً، وإلا استخدام الافتراضي
    const loginWebhookUrl = process.env.LOGIN_DISCORD_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL;
    if (!loginWebhookUrl) {
      console.error("Discord webhook URL is not configured.");
      return false;
    }
    
    // تحديد اللون والرمز حسب نوع تسجيل الدخول
    let color;
    let emoji;
    let title;
    let description;
    let actionType = loginData.isLogout ? "تسجيل خروج" : "تسجيل دخول";
    
    if (loginData.isAdmin) {
      // مشرف
      color = 0xF44336; // أحمر للمشرفين
      emoji = '🛡️';
      title = `${actionType} مشرف: ${loginData.username}`;
      description = loginData.isLogout 
        ? `⚠️ تم تسجيل خروج مشرف`
        : `⚠️ تم تسجيل دخول مشرف باستخدام ${getLoginMethodText(loginData.loginMethod)}`;
    } else if (loginData.loginMethod === 'guest') {
      // زائر
      color = 0x2196F3; // أزرق للزوار
      emoji = '👻';
      title = `${actionType} زائر: ${loginData.username}`;
      description = loginData.isLogout 
        ? `تم تسجيل خروج زائر`
        : `تم تسجيل دخول زائر جديد`;
    } else {
      // مستخدم عادي
      color = 0x4CAF50; // أخضر للمستخدم العادي
      emoji = '👤';
      title = `${actionType} مستخدم: ${loginData.username}`;
      description = loginData.isLogout
        ? `تم تسجيل خروج مستخدم`
        : `تم تسجيل دخول مستخدم باستخدام ${getLoginMethodText(loginData.loginMethod)}`;
    }
    
    // إرسال البيانات إلى Discord
    const response = await fetch(loginWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: `${emoji} **${actionType} ${loginData.isAdmin ? 'مشرف' : 'مستخدم'}** ${emoji}`,
        embeds: [{
          title: title,
          description: description,
          color: color,
          timestamp: new Date().toISOString(),
          fields: [
            {
              name: '👤 معلومات المستخدم',
              value: `**الاسم**: ${loginData.username}\n**المعرف**: ${loginData.userId || 'غير متوفر'}\n**البريد الإلكتروني**: ${loginData.email || 'غير متوفر'}`,
              inline: true
            },
            {
              name: '🔐 وسيلة الدخول',
              value: `**الطريقة**: ${getLoginMethodText(loginData.loginMethod)}\n**الوقت**: ${loginData.loginTime.toLocaleString('ar-EG')}`,
              inline: true
            },
            {
              name: '💻 معلومات فنية',
              value: `**متصفح**: ${loginData.userAgent || 'غير متوفر'}\n**عنوان IP**: ${loginData.ipAddress || 'غير متوفر'}`,
              inline: false
            }
          ],
          footer: {
            text: "نظام تسجيل الدخول - كويك ريسب"
          }
        }]
      }),
    });
    
    if (!response.ok) {
      console.error(`Discord webhook error: ${response.status} ${response.statusText}`);
      const responseText = await response.text();
      console.error(`Discord response: ${responseText}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error sending login notification:', error);
    return false;
  }
}

/**
 * تحويل نوع تسجيل الدخول إلى نص مفهوم
 */
function getLoginMethodText(method: 'google' | 'admin' | 'guest'): string {
  switch (method) {
    case 'google':
      return 'حساب Google';
    case 'admin':
      return 'حساب المشرف';
    case 'guest':
      return 'وضع الزائر';
    default:
      return 'غير معروف';
  }
}

export async function sendAutoRemovalNotification(postId: number, reportsCount: number, reason: string = 'تم الحذف تلقائياً'): Promise<boolean> {
  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("Discord webhook URL is not configured.");
      return false;
    }

    // الحصول على بيانات المنشور
    const post = await storage.getCommunityPost(postId);
    if (!post) {
      console.error(`Post not found for auto-removal notification: ${postId}`);
      return false;
    }
    
    // الحصول على بيانات منشئ المنشور
    const postCreator = await storage.getUser(post.userId);
    
    // إرسال البيانات إلى Discord
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: `🚫 **تم حذف منشور: ${reason}** 🚫`,
        embeds: [{
          title: `منشور محذوف: ${post.title || 'بدون عنوان'}`,
          color: 0x000000, // أسود للإشارة إلى الحذف
          timestamp: new Date().toISOString(),
          fields: [
            {
              name: '📝 سبب الحذف',
              value: reason,
              inline: false
            },
            {
              name: '🧾 محتوى المنشور',
              value: post.content ? (post.content.length > 300 ? post.content.substring(0, 297) + '...' : post.content) : 'بدون محتوى',
              inline: false
            },
            {
              name: '👤 منشئ المحتوى',
              value: `**الاسم**: ${postCreator?.username || 'غير معروف'}\n**المعرف**: ${post.userId || 'غير متوفر'}`,
              inline: true
            },
            {
              name: '📊 الإحصائيات',
              value: `**عدد البلاغات**: ${reportsCount}\n**تاريخ الحذف**: ${new Date().toLocaleString('ar-EG')}`,
              inline: true
            }
          ],
          footer: {
            text: "نظام إدارة المحتوى - كويك ريسب"
          }
        }]
      }),
    });

    if (!response.ok) {
      console.error(`Discord webhook error: ${response.status} ${response.statusText}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending auto-removal notification:', error);
    return false;
  }
}