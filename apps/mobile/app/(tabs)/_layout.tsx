import { Tabs } from "expo-router";
import { CircleUser, MessagesSquare, Navigation } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { color, font } from "../../src/lib/theme";

export default function TabLayout() {
  const inset = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: color.p600,
        tabBarInactiveTintColor: color.textMuted,
        tabBarStyle: {
          height: 56 + inset.bottom,
          paddingTop: 5,
          paddingBottom: Math.max(inset.bottom, 5),
          backgroundColor: color.card,
          borderTopColor: color.borderSubtle,
        },
        tabBarLabelStyle: { fontFamily: font.sansSemiBold, fontSize: 11 },
        headerShown: true,
        headerTitleStyle: { fontFamily: font.sansBold, color: color.textStrong },
        headerStyle: { backgroundColor: color.card },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Plan",
          headerShown: false,
          tabBarIcon: ({ color: tint, size }) => (
            <Navigation color={tint} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Updates",
          headerTitle: "Alitaptap · Updates",
          tabBarIcon: ({ color: tint, size }) => (
            <MessagesSquare color={tint} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "You",
          headerTitle: "Alitaptap · You",
          tabBarIcon: ({ color: tint, size }) => (
            <CircleUser color={tint} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
