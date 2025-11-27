import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aisocialmanager.app',
  appName: 'AISocialManager',
  webDir: 'public',
  server: {
    url: 'https://ai-social-manager-fh7s2dksf-hirotos-projects-f5e9bbfe.vercel.app',
    allowNavigation: [
      'ai-social-manager-fh7s2dksf-hirotos-projects-f5e9bbfe.vercel.app',
      '*.vercel.app'
    ],
    androidScheme: 'https'
  }
};

export default config;
