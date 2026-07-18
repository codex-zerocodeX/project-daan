import type { Session } from "@supabase/supabase-js";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { AuthForm } from "../../src/components/AuthForm";
import { Button } from "../../src/components/ui/Button";
import { Pill } from "../../src/components/ui/Pill";
import { useProfile } from "../../src/hooks/useProfile";
import { useSession } from "../../src/hooks/useSession";
import { supabase } from "../../src/lib/supabase";
import { color, font, radius, shadow, text } from "../../src/lib/theme";

function ProfileView({ session }: { session: Session }) {
  const { data: profile, error, isPending } = useProfile(session.user.id);

  if (isPending) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={color.p500} />
      </View>
    );
  }

  const name = profile ? profile.username : (session.user.email ?? "Rider");

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name[0]?.toUpperCase() ?? "?"}</Text>
        </View>
        <Text style={styles.username}>{name}</Text>
        {profile && (
          <Pill bg={color.primarySoft} fg={color.p700}>
            {`${profile.karma} karma`}
          </Pill>
        )}
        {error && (
          <Text style={styles.error}>
            Could not load profile: {error.message}
          </Text>
        )}
      </View>
      <Button variant="outline" full onPress={() => supabase.auth.signOut()}>
        Sign out
      </Button>
    </View>
  );
}

export default function ProfileScreen() {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={color.p500} />
      </View>
    );
  }

  return session ? <ProfileView session={session} /> : <AuthForm />;
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12, backgroundColor: color.bgApp },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.bgApp,
  },
  card: {
    backgroundColor: color.card,
    borderWidth: 1,
    borderColor: color.borderSubtle,
    borderRadius: radius.xl,
    padding: 24,
    alignItems: "center",
    gap: 10,
    ...shadow.card,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: color.p200,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: text.h1,
    fontFamily: font.sansExtraBold,
    color: color.p700,
  },
  username: {
    fontSize: text.h2,
    fontFamily: font.sansExtraBold,
    color: color.textStrong,
  },
  error: {
    color: color.alert,
    fontFamily: font.sansMedium,
    fontSize: text.sm,
    textAlign: "center",
  },
});
