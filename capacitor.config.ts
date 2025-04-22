import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.egyptco.quickrecipe',
  appName: 'كويك ريسب',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https'
  },
  // تكوين خاص للغة العربية والتطبيق RTL
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#B84414",
      splashFullScreen: true,
      splashImmersive: true,
    }
  }
};

export default config;