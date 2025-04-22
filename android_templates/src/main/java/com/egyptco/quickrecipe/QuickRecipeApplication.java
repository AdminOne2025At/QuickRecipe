package com.egyptco.quickrecipe;

import android.app.Application;
import android.util.Log;
import android.webkit.WebView;

/**
 * الفئة الرئيسية للتطبيق المسؤولة عن التهيئة العامة
 */
public class QuickRecipeApplication extends Application {
    
    private static final String TAG = "QuickRecipeApp";
    
    @Override
    public void onCreate() {
        super.onCreate();
        
        // تمكين تصحيح الأخطاء في WebView إذا كان التطبيق في وضع التطوير
        if (BuildConfig.DEBUG) {
            WebView.setWebContentsDebuggingEnabled(true);
        }
        
        // طباعة شعار الدب في سجلات التطبيق
        printBearLogo();
        
        // هنا يمكن إضافة أي تهيئة إضافية مطلوبة للتطبيق
        // مثل تهيئة مكتبات التحليلات، مكتبات الإعدادات، إلخ.
    }
    
    /**
     * طباعة شعار الدب في السجلات
     */
    private void printBearLogo() {
        Log.d(TAG, "كويك ريسب - تطبيق وصفات الطعام");
        Log.d(TAG, "------------------------------");
        Log.d(TAG, "  ʕ •ᴥ• ʔ  تم تشغيل تطبيق كويك ريسب");
        Log.d(TAG, "------------------------------");
    }
}