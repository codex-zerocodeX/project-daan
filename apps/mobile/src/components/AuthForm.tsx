import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { supabase } from "../lib/supabase";
import { color, font, radius, text } from "../lib/theme";
import { Button } from "./ui/Button";

export function AuthForm() {
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (mode === "signUp" && !username.trim()) {
      setError("Pick a username first.");
      return;
    }
    setBusy(true);
    setError(null);
    const result =
      mode === "signIn"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { data: { username: username.trim() } },
          });
    if (result.error) setError(result.error.message);
    setBusy(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        {mode === "signIn" ? "Sign in to Komyut" : "Join Komyut"}
      </Text>
      <Text style={styles.subheading}>
        Community-powered commuting for the Philippines.
      </Text>
      {mode === "signUp" && (
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor={color.textMuted}
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={color.textMuted}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={color.textMuted}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button size="lg" full loading={busy} onPress={submit}>
        {mode === "signIn" ? "Sign in" : "Sign up"}
      </Button>
      <Button
        variant="ghost"
        full
        onPress={() => setMode(mode === "signIn" ? "signUp" : "signIn")}
      >
        {mode === "signIn" ? "No account? Sign up" : "Have an account? Sign in"}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12, backgroundColor: color.bgApp },
  heading: {
    fontSize: text.h1,
    fontFamily: font.sansExtraBold,
    color: color.textStrong,
    letterSpacing: -0.5,
    marginTop: 12,
  },
  subheading: {
    fontSize: text.bodyMd,
    fontFamily: font.sansMedium,
    color: color.textMuted,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: color.borderStrong,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    fontSize: text.bodyMd,
    fontFamily: font.sansMedium,
    color: color.textStrong,
    backgroundColor: color.card,
  },
  error: {
    color: color.alert,
    fontFamily: font.sansMedium,
    fontSize: text.sm,
  },
});
