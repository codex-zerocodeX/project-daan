import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import type { Session } from "@supabase/supabase-js";
import { AuthForm } from "../../src/components/AuthForm";
import { useProfile } from "../../src/hooks/useProfile";
import { useSession } from "../../src/hooks/useSession";
import { supabase } from "../../src/lib/supabase";

function ProfileView({ session }: { session: Session }) {
  const { data: profile, error, isPending } = useProfile(session.user.id);

  if (isPending) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.username}>{profile ? profile.username : session.user.email}</Text>
      {profile && <Text style={styles.karma}>Karma: {profile.karma}</Text>}
      {error && <Text style={styles.error}>Could not load profile: {error.message}</Text>}
      <Pressable style={styles.signOut} onPress={() => supabase.auth.signOut()}>
        <Text style={styles.signOutText}>Sign out</Text>
      </Pressable>
    </View>
  );
}

export default function ProfileScreen() {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return session ? <ProfileView session={session} /> : <AuthForm />;
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 8 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  username: { fontSize: 24, fontWeight: "700" },
  karma: { fontSize: 16, color: "#0a7ea4", fontWeight: "600" },
  error: { color: "#c0392b" },
  signOut: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#c0392b",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  signOutText: { color: "#c0392b", fontWeight: "600" },
});
