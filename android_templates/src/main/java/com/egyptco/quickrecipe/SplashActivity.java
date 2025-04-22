package com.egyptco.quickrecipe;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import androidx.appcompat.app.AppCompatActivity;

public class SplashActivity extends AppCompatActivity {
    // مدة عرض شاشة البداية بالميللي ثانية
    private static final int SPLASH_DISPLAY_LENGTH = 2000;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // استخدام نمط شاشة البداية بدلاً من تعيين محتوى العرض
        // يتم تعيين الخلفية في ملف styles.xml
        
        // تأخير وانتقال إلى النشاط الرئيسي
        new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
            @Override
            public void run() {
                // إنشاء نية (Intent) للانتقال إلى النشاط الرئيسي
                Intent mainIntent = new Intent(SplashActivity.this, MainActivity.class);
                startActivity(mainIntent);
                finish();
            }
        }, SPLASH_DISPLAY_LENGTH);
    }
}