import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aisocialmanager.app',
  appName: 'AISocialManager',
  webDir: 'public',
  server: {
    // 本番環境のURL（VercelのデプロイURL）をここに設定します
    // url: 'https://your-project.vercel.app',

    // ローカル開発用（PCのIPアドレスを指定すると実機で確認できます）
    // url: 'http://192.168.1.X:3000',
    // cleartext: true,

    androidScheme: 'https'
  }
};

export default config;
