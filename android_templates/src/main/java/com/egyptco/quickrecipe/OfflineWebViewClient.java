package com.egyptco.quickrecipe;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.view.View;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.TextView;

/**
 * WebViewClient مخصص للتعامل مع حالة عدم الاتصال بالإنترنت
 * وعرض صفحة خطأ مناسبة للمستخدم
 */
public class OfflineWebViewClient extends WebViewClient {
    private final Context context;
    private final View offlineView;

    public OfflineWebViewClient(Context context, View offlineView) {
        this.context = context;
        this.offlineView = offlineView;
    }

    /**
     * التحقق من حالة الاتصال بالإنترنت
     */
    private boolean isNetworkAvailable() {
        ConnectivityManager connectivityManager = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
        return activeNetworkInfo != null && activeNetworkInfo.isConnected();
    }

    @Override
    public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
        super.onReceivedError(view, request, error);
        
        // التحقق مما إذا كان الخطأ متعلقًا بالصفحة الرئيسية
        if (request.isForMainFrame()) {
            // عرض شاشة عدم الاتصال
            showOfflineView(view);
        }
    }

    @Override
    public void onPageFinished(WebView view, String url) {
        super.onPageFinished(view, url);
        
        // إذا كان الاتصال مستعادًا، تأكد من إخفاء عرض عدم الاتصال
        if (isNetworkAvailable()) {
            hideOfflineView(view);
            
            // تنفيذ JavaScript لضبط الاتجاه RTL ودعم اللغة العربية
            view.evaluateJavascript(
                "document.documentElement.dir = 'rtl';" +
                "document.documentElement.lang = 'ar-EG';", 
                null
            );
        }
    }

    /**
     * عرض واجهة عدم الاتصال
     */
    private void showOfflineView(final WebView webView) {
        if (offlineView != null) {
            // إظهار عرض عدم الاتصال
            offlineView.setVisibility(View.VISIBLE);
            webView.setVisibility(View.GONE);
            
            // إعداد زر إعادة المحاولة
            Button retryButton = offlineView.findViewById(R.id.btn_retry);
            if (retryButton != null) {
                retryButton.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        // التحقق من استعادة الاتصال
                        if (isNetworkAvailable()) {
                            // إعادة تحميل الصفحة
                            webView.reload();
                            hideOfflineView(webView);
                        }
                    }
                });
            }
            
            // عرض رسالة عدم الاتصال
            TextView offlineMessage = offlineView.findViewById(R.id.tv_offline_message);
            if (offlineMessage != null) {
                offlineMessage.setText(R.string.offline_message);
            }
        }
    }

    /**
     * إخفاء واجهة عدم الاتصال
     */
    private void hideOfflineView(WebView webView) {
        if (offlineView != null) {
            offlineView.setVisibility(View.GONE);
            webView.setVisibility(View.VISIBLE);
        }
    }
}