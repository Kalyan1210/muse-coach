// Load env vars using require (CommonJS style)
require('dotenv').config();

module.exports = {
  expo: {
    name: "Muse",
    slug: "muse-coach",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#FAF9F7"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.muse.coach"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FAF9F7"
      },
      edgeToEdgeEnabled: true,
      package: "com.muse.coach"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-font"
    ],
    extra: {
      openaiApiKey: process.env.OPENAI_API_KEY,
      revenuecatIosApiKey: process.env.REVENUECAT_IOS_API_KEY,
      revenuecatAndroidApiKey: process.env.REVENUECAT_ANDROID_API_KEY,
    }
  }
};
