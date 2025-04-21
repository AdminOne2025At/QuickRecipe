/**
 * خدمة إشعارات Discord لإرسال تقارير المحتوى المسيء
 * تستخدم Discord Webhook لإرسال رسائل إلى قناة محددة
 */

import fetch from 'node-fetch';
import { CommunityPost, PostReport, User } from '@shared/schema';
import { storage } from '../storage';

// واجهة لبيانات الإبلاغ الكاملة مع معلومات المستخدم والمنشور
interface ReportDetailsPayload {
  report: PostReport;
  post: CommunityPost;
  reporter: Partial<User>;
  postCreator: Partial<User>;
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
    // الحصول على بيانات البلاغ
    const reports = await storage.getPostReports(reportId);
    if (!reports || reports.length === 0) {
      return null;
    }
    
    const report = reports[0];
    
    // الحصول على بيانات المنشور
    const post = await storage.getCommunityPost(report.postId);
    if (!post) {
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
        value: `**عدد البلاغات**: ${post.reportsCount || 1}\n**تاريخ الإبلاغ**: ${reportDate}`,
        inline: false
      },
      {
        name: '🔗 روابط',
        value: `[عرض المنشور](${process.env.APP_URL || ''}/community-posts/${post.id})`,
        inline: false
      }
    ],
    footer: {
      text: "نظام إدارة المحتوى - كويك ريسيبي"
    }
  };
}

/**
 * إرسال إشعار عند حذف منشور تلقائيًا بسبب كثرة البلاغات
 * 
 * @param postId معرف المنشور المحذوف
 * @param reportsCount عدد البلاغات
 * @returns وعد بنتيجة العملية
 */
export async function sendAutoRemovalNotification(postId: number, reportsCount: number): Promise<boolean> {
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
        content: "🚫 **تم حذف منشور تلقائيًا بسبب كثرة البلاغات** 🚫",
        embeds: [{
          title: `منشور محذوف: ${post.title || 'بدون عنوان'}`,
          color: 0x000000, // أسود للإشارة إلى الحذف
          timestamp: new Date().toISOString(),
          fields: [
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
            text: "نظام إدارة المحتوى - كويك ريسيبي"
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