import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "ALITAPTAP",
  slug: "komyut",
  version: "0.1.0",
  scheme: "komyut",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  userInterfaceStyle: "automatic",
  ios: {
    supportsTablet: false,
    bundleIdentifier: "ph.komyut.app",
  },
  android: {
    package: "ph.komyut.app",
    adaptiveIcon: {
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundColor: "#ffffff",
    },
  },
  plugins: [
    "expo-router",
    "@maplibre/maplibre-react-native",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
    [
      "expo-location",
      {
        locationWhenInUsePermission:
          "ALITAPTAP uses your location to show you on the map and plan commute routes.",
      },
    ],
  ],
  extra: {
    eas: {
      projectId: "d3b180aa-d3e2-4737-9b74-e3f3a12e7dfc",
    },
  },
};

export default config;
