package com.egyptco.quickrecipe;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.view.View;
import android.view.WindowManager;
import android.graphics.Color;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private WebView customWebView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // إعداد الشاشة بدون شريط العنوان
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE |
                View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);
        getWindow().setStatusBarColor(Color.TRANSPARENT);

        // إعداد الـ WebView المخصص للتطبيق الخاص بنا
        setupCustomWebView();
    }

    private void setupCustomWebView() {
        // الحصول على WebView الموجود في Capacitor
        WebView capacitorWebView = getBridge().getWebView();
        
        // تطبيق الإعدادات المخصصة
        WebSettings settings = capacitorWebView.getSettings();
        
        // تفعيل JavaScript (ضروري لتطبيقنا الذي يعتمد على React)
        settings.setJavaScriptEnabled(true);
        
        // تخزين مؤقت محسن
        settings.setDomStorageEnabled(true);
        settings.setAppCacheEnabled(true);
        
        // تمكين الوضع بدون اتصال بالإنترنت
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        
        // تمكين تكبير المحتوى (pinch-to-zoom)
        settings.setBuiltInZoomControls(true);
        settings.setDisplayZoomControls(false);
        
        // تحسين الأداء
        settings.setRenderPriority(WebSettings.RenderPriority.HIGH);
        
        // إعداد WebViewClient مخصص
        capacitorWebView.setWebViewClient(new QuickRecipeWebViewClient());
    }

    // فئة WebViewClient المخصصة
    private class QuickRecipeWebViewClient extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            // التعامل مع الروابط داخل التطبيق
            if (url.contains(getBridge().getServerUrl())) {
                // الروابط الداخلية تفتح داخل WebView
                return false;
            }
            
            // يمكنك هنا إضافة منطق إضافي للتعامل مع الروابط الخارجية
            // مثلاً فتحها في المتصفح الخارجي أو التعامل معها بشكل خاص
            
            return super.shouldOverrideUrlLoading(view, url);
        }
        
        @Override
        public void onPageFinished(WebView view, String url) {
            super.onPageFinished(view, url);
            
            // تنفيذ JavaScript لضبط الاتجاه RTL ودعم اللغة العربية
            view.evaluateJavascript(
                "document.documentElement.dir = 'rtl';" +
                "document.documentElement.lang = 'ar-EG';", 
                null
            );
        }
    }
}