package com.egyptco.quickrecipe;

import android.app.Application;
import android.webkit.WebView;

/**
 * الفئة الرئيسية للتطبيق المسؤولة عن التهيئة العامة
 */
public class QuickRecipeApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        
        // تمكين تصحيح الأخطاء في WebView إذا كان التطبيق في وضع التطوير
        if (BuildConfig.DEBUG) {
            WebView.setWebContentsDebuggingEnabled(true);
        }
        
        // هنا يمكن إضافة أي تهيئة إضافية مطلوبة للتطبيق
        // مثل تهيئة مكتبات التحليلات، مكتبات الإعدادات، إلخ.
    }
}