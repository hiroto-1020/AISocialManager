import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aisocialmanager.app',
  appName: 'AISocialManager',
  webDir: 'public',
  server: {
    url: 'https://ai-social-manager-lilac.vercel.app',
    allowNavigation: [
      'ai-social-manager-lilac.vercel.app',
      '*.vercel.app'
    ],
    androidScheme: 'https'
  }
};

export default config;
