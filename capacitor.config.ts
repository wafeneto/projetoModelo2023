import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  //appId: 'io.ionic.starter',
  appId: 'io.projetomodelo.starternew',
  appName: 'projeto-modelo-2023',
  webDir: 'www',
  bundledWebRuntime: false,

  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
