import { Tabs } from "expo-router";
import { CircleUser, MessagesSquare, Navigation } from "lucide-react-native";
import { color, font } from "../../src/lib/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: color.p600,
        tabBarInactiveTintColor: color.textMuted,
        tabBarStyle: {
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
          title: "Go",
          headerShown: false,
          tabBarIcon: ({ color: tint, size }) => (
            <Navigation color={tint} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarIcon: ({ color: tint, size }) => (
            <MessagesSquare color={tint} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color: tint, size }) => (
            <CircleUser color={tint} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
