package com.egyptco.quickrecipe;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

/**
 * النشاط الرئيسي للتطبيق الذي يحتوي على WebView 
 * لعرض تطبيق الويب
 */
public class MainActivity extends AppCompatActivity {
    private WebView webView;
    private View offlineView;
    private long backPressedTime = 0;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // الحصول على مرجع WebView
        webView = findViewById(R.id.webview);
        offlineView = findViewById(R.id.offline_view);

        // تكوين إعدادات WebView
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);        // تمكين جافا سكريبت
        webSettings.setDomStorageEnabled(true);        // تمكين تخزين DOM
        webSettings.setDatabaseEnabled(true);          // تمكين قاعدة البيانات
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT); // استخدام التخزين المؤقت بشكل افتراضي
        webSettings.setMediaPlaybackRequiresUserGesture(false); // السماح بتشغيل الوسائط دون تفاعل المستخدم
        
        // تمكين ملفات تعريف الارتباط والجلسات
        android.webkit.CookieManager cookieManager = android.webkit.CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        cookieManager.setAcceptThirdPartyCookies(webView, true);
        cookieManager.flush();
        
        // للتطبيقات المستجيبة
        webSettings.setUseWideViewPort(true);          // استخدام منفذ عرض واسع
        webSettings.setLoadWithOverviewMode(true);     // تحميل الصفحات في وضع النظرة العامة
        
        // تحسين الأداء وحفظ الحالة
        webSettings.setRenderPriority(WebSettings.RenderPriority.HIGH);
        webSettings.setAppCacheEnabled(true);
        webSettings.setSaveFormData(true);
        webSettings.setSavePassword(true);
        
        // تعيين WebViewClient مخصص للتعامل مع حالة عدم الاتصال
        webView.setWebViewClient(new OfflineWebViewClient(this, offlineView));
        
        // تعيين WebChromeClient للتعامل مع مربعات الحوار والتنبيهات
        webView.setWebChromeClient(new WebChromeClient());
        
        // تحميل عنوان URL للتطبيق
        webView.loadUrl("https://quickrecipe.repl.co/");
    }

    /**
     * التعامل مع زر العودة للخلف
     * إذا كان WebView يمكنه العودة للخلف، سينتقل للخلف
     * وإلا سيتم عرض رسالة "اضغط مرة أخرى للخروج" ثم الخروج عند الضغط مرة ثانية
     */
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            if (backPressedTime + 2000 > System.currentTimeMillis()) {
                super.onBackPressed();
                return;
            } else {
                Toast.makeText(this, "اضغط مرة أخرى للخروج", Toast.LENGTH_SHORT).show();
            }
            backPressedTime = System.currentTimeMillis();
        }
    }
}