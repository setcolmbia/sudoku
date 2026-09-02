import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.setcolombia.numi',
  appName: 'Numi',
  webDir: 'dist',
  backgroundColor: '#0a0c16',
  android: {
    backgroundColor: '#0a0c16',
  },
  plugins: {
    SplashScreen: {
      backgroundColor: '#0a0c16',
      showSpinner: false,
    },
  },
};

export default config;
