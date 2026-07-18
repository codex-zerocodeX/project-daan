import { ThreadCategorySchema, ThreadSchema } from "@komyut/shared";
import type { ThreadCategory } from "@komyut/shared";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Send } from "lucide-react-native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "../src/components/ui/Button";
import { Pill } from "../src/components/ui/Pill";
import { ensureDemoSession } from "../src/hooks/useDemoSession";
import { supabase } from "../src/lib/supabase";
import { color, font, radius, shadow, text } from "../src/lib/theme";

const CATEGORIES = ThreadCategorySchema.options;
const TITLE_MAX = 200;
const BODY_MAX = 5000;

const CATEGORY_LABELS: Record<ThreadCategory, string> = {
  route: "Route",
  terminal: "Terminal",
  hazard: "Hazard",
  walkability: "Walkability",
  general: "General",
};

/** Seeds the title from the trip the user just searched for. Fully editable. */
function initialTitle(originName?: string, destName?: string): string {
  if (originName && destName)
    return `How do I get from ${originName} to ${destName}?`;
  if (destName) return `How do I get to ${destName}?`;
  return "";
}

type FieldErrors = { title?: string; body?: string };

/**
 * Validates against the shared `ThreadSchema` shapes, which mirror the DB
 * check constraints (title 1-200, body <= 5000), so we fail here rather than
 * on a rejected insert.
 */
function validate(title: string, body: string): FieldErrors {
  const errors: FieldErrors = {};

  const titleResult = ThreadSchema.shape.title.safeParse(title);
  if (!title) errors.title = "Give your question a title.";
  else if (!titleResult.success)
    errors.title = `Keep the title under ${TITLE_MAX} characters.`;

  const bodyResult = ThreadSchema.shape.body.safeParse(body);
  if (!body) errors.body = "Add some details so people can answer.";
  else if (!bodyResult.success)
    errors.body = `Keep the details under ${BODY_MAX} characters.`;

  return errors;
}

export default function AskScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{
    originName?: string;
    destName?: string;
  }>();

  const [title, setTitle] = useState(() =>
    initialTitle(params.originName, params.destName),
  );
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<ThreadCategory>("route");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();

    const errors = validate(trimmedTitle, trimmedBody);
    setFieldErrors(errors);
    if (errors.title || errors.body) return;

    setSubmitError(null);
    setSubmitting(true);
    try {
      // Session is resolved here, at submit time, so typing is never gated on
      // the network.
      const { userId, error: sessionError } = await ensureDemoSession();
      if (!userId) {
        setSubmitError(
          sessionError ?? "Could not start a session. Please try again.",
        );
        return;
      }

      const { data, error } = await supabase
        .from("threads")
        .insert({
          author_id: userId,
          title: trimmedTitle,
          body: trimmedBody,
          category,
        })
        .select("id")
        .single();

      if (error) {
        setSubmitError(error.message);
        return;
      }

      // Refresh the community list and any trip-specific search results.
      // Thread search keys are ["thread-search", oLat, oLng, dLat, dLng], so
      // invalidate by prefix.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["threads"] }),
        queryClient.invalidateQueries({ queryKey: ["thread-search"] }),
      ]);

      router.replace({ pathname: "/thread/[id]", params: { id: data.id } });
    } catch (err: unknown) {
      // Never swallow the failure and never clear what they typed.
      setSubmitError(
        err instanceof Error ? err.message : "Could not post your question.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeft size={20} color={color.textBody} />
        </Pressable>
        <Text style={styles.headerTitle}>Ask the community</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>
          No one has answered this trip yet. Ask, and commuters who know the
          route can map it out for you.
        </Text>

        <View style={styles.card}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Question</Text>
            <Text style={styles.counter}>
              {title.length}/{TITLE_MAX}
            </Text>
          </View>
          <TextInput
            style={[styles.input, fieldErrors.title && styles.inputError]}
            value={title}
            onChangeText={setTitle}
            placeholder="How do I get from Cubao to Makati?"
            placeholderTextColor={color.textMuted}
            multiline
            maxLength={TITLE_MAX}
            editable={!submitting}
          />
          {fieldErrors.title ? (
            <Text style={styles.fieldError}>{fieldErrors.title}</Text>
          ) : null}
        </View>

        <View style={styles.card}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Details</Text>
            <Text style={styles.counter}>
              {body.length}/{BODY_MAX}
            </Text>
          </View>
          <TextInput
            style={[
              styles.input,
              styles.bodyInput,
              fieldErrors.body && styles.inputError,
            ]}
            value={body}
            onChangeText={setBody}
            placeholder="What time do you travel? Any landmarks, budget, or constraints?"
            placeholderTextColor={color.textMuted}
            multiline
            textAlignVertical="top"
            maxLength={BODY_MAX}
            editable={!submitting}
          />
          {fieldErrors.body ? (
            <Text style={styles.fieldError}>{fieldErrors.body}</Text>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.chipRow}>
            {CATEGORIES.map((option) => {
              const selected = option === category;
              return (
                <Pressable
                  key={option}
                  onPress={() => setCategory(option)}
                  disabled={submitting}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  style={({ pressed }) => [
                    styles.chip,
                    selected && styles.chipSelected,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipLabel,
                      selected && styles.chipLabelSelected,
                    ]}
                  >
                    {CATEGORY_LABELS[option]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {submitError ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{submitError}</Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 14 }]}>
        <View style={styles.identityRow}>
          <Pill bg={color.primarySoft} fg={color.p700}>
            demo_user
          </Pill>
          <Text style={styles.identityNote}>
            Shared demo account for this prototype
          </Text>
        </View>
        <Button
          full
          size="lg"
          loading={submitting}
          disabled={submitting}
          onPress={handleSubmit}
          icon={<Send size={18} color={color.textOnPrimary} />}
        >
          {submitting ? "Posting..." : "Post question"}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.bgApp },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingBottom: 12,
    backgroundColor: color.card,
    borderBottomWidth: 1,
    borderBottomColor: color.borderSubtle,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: color.sunken,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { opacity: 0.7 },
  headerTitle: {
    fontSize: text.h2,
    fontFamily: font.sansBold,
    color: color.textStrong,
  },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 14, paddingBottom: 24 },
  intro: {
    fontSize: text.bodyMd,
    fontFamily: font.sans,
    color: color.textMuted,
    lineHeight: 21,
  },
  card: {
    backgroundColor: color.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.borderSubtle,
    padding: 16,
    gap: 10,
    ...shadow.xs,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: text.xs,
    fontFamily: font.sansBold,
    textTransform: "uppercase",
    letterSpacing: 0.44,
    color: color.textMuted,
  },
  counter: {
    fontSize: text.xs,
    fontFamily: font.mono,
    color: color.textMuted,
  },
  input: {
    fontSize: text.bodyLg,
    fontFamily: font.sansMedium,
    color: color.textStrong,
    backgroundColor: color.sunken,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.borderSubtle,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 48,
  },
  bodyInput: { minHeight: 132, fontFamily: font.sans, fontSize: text.bodyMd },
  inputError: { borderColor: color.alert, backgroundColor: color.alertBg },
  fieldError: {
    fontSize: text.sm,
    fontFamily: font.sansMedium,
    color: color.alert,
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    backgroundColor: color.sunken,
    borderWidth: 1,
    borderColor: color.borderSubtle,
  },
  chipSelected: { backgroundColor: color.p500, borderColor: color.p500 },
  chipLabel: {
    fontSize: text.sm,
    fontFamily: font.sansSemiBold,
    color: color.textBody,
  },
  chipLabelSelected: { color: color.textOnPrimary },
  errorBanner: {
    backgroundColor: color.alertBg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.alert,
    padding: 14,
  },
  errorBannerText: {
    fontSize: text.bodyMd,
    fontFamily: font.sansMedium,
    color: color.alert,
    lineHeight: 20,
  },
  footer: {
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 14,
    backgroundColor: color.card,
    borderTopWidth: 1,
    borderTopColor: color.borderSubtle,
  },
  identityRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  identityNote: {
    fontSize: text.xs,
    fontFamily: font.sans,
    color: color.textMuted,
    flexShrink: 1,
  },
});
