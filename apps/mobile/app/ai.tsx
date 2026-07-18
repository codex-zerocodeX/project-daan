import { useRouter } from "expo-router";
import { ArrowUp, ChevronLeft, Sparkles } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
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
import { ThreadCard } from "../src/components/ThreadCard";
import { useAiSearch } from "../src/hooks/useAiSearch";
import { useThreads } from "../src/hooks/useThreads";
import { color, font, radius, shadow, space, text } from "../src/lib/theme";

type Turn = { question: string; answer: string; sourceIds: string[] };

/** How many prior exchanges to send as context. Matches the server's cap. */
const HISTORY_TURNS = 3;

const SUGGESTIONS = [
  "How do I get to Ayala on a budget?",
  "MRT or jeep at rush hour?",
  "What time is the last train?",
];

export default function AiSearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const { data: threads } = useThreads();
  const ai = useAiSearch();
  const [draft, setDraft] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);

  const canSend = draft.trim().length >= 3 && !ai.isPending;

  function send(question: string) {
    const q = question.trim();
    if (q.length < 3 || ai.isPending) return;
    setDraft("");
    // Send the last few exchanges so follow-ups like "what about at night?"
    // resolve against what was just asked.
    const history = turns
      .slice(-HISTORY_TURNS)
      .map(({ question, answer }) => ({ question, answer }));

    ai.mutate(
      { query: q, history },
      {
        onSuccess: (res) =>
          setTurns((prev) => [
            ...prev,
            { question: q, answer: res.answer, sourceIds: res.thread_ids },
          ]),
      },
    );
  }

  const empty = turns.length === 0 && !ai.isPending && !ai.error;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.back}
        >
          <ChevronLeft size={22} color={color.textStrong} />
        </Pressable>
        <Text style={styles.headerTitle}>Ask AI</Text>
        <View style={styles.back} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={insets.top + 44}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
        >
          {empty && (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Sparkles size={22} color={color.p600} />
              </View>
              <Text style={styles.emptyTitle}>
                Ask about routes, fares, or terminals
              </Text>
              <Text style={styles.emptyBody}>
                Answers come only from what the community has posted, with the
                threads they came from.
              </Text>
              <View style={styles.suggestions}>
                {SUGGESTIONS.map((s) => (
                  <Pressable
                    key={s}
                    onPress={() => send(s)}
                    style={({ pressed }) => [
                      styles.suggestion,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text style={styles.suggestionText}>{s}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {turns.map((turn, i) => (
            <View key={`${turn.question}-${i}`} style={styles.turn}>
              <View style={styles.question}>
                <Text style={styles.questionText}>{turn.question}</Text>
              </View>

              <View style={styles.answer}>
                <Text style={styles.answerText}>{turn.answer}</Text>
              </View>

              {turn.sourceIds.length > 0 && (
                <View style={styles.sources}>
                  <Text style={styles.sourcesLabel}>
                    FROM {turn.sourceIds.length} THREAD
                    {turn.sourceIds.length > 1 ? "S" : ""}
                  </Text>
                  {turn.sourceIds
                    .map((id) => (threads ?? []).find((t) => t.id === id))
                    .filter((t) => t !== undefined)
                    .map((t) => (
                      <ThreadCard key={t.id} thread={t} />
                    ))}
                </View>
              )}
            </View>
          ))}

          {ai.isPending && (
            <View style={styles.thinking}>
              <ActivityIndicator color={color.p500} />
              <Text style={styles.thinkingText}>Reading threads…</Text>
            </View>
          )}

          {ai.error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>
                AI search is unavailable right now. Browse the Community feed
                instead.
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={[styles.composer, { paddingBottom: insets.bottom + space.s3 }]}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={() => send(draft)}
            // A multiline input swallows Enter, so on web submit it explicitly
            // and leave shift+Enter for a newline.
            onKeyPress={(e) => {
              const ev = e.nativeEvent as { key: string; shiftKey?: boolean };
              if (Platform.OS === "web" && ev.key === "Enter" && !ev.shiftKey) {
                e.preventDefault();
                send(draft);
              }
            }}
            placeholder="Ask a question…"
            placeholderTextColor={color.textMuted}
            returnKeyType="send"
            multiline
            style={styles.input}
          />
          <Pressable
            onPress={() => send(draft)}
            disabled={!canSend}
            accessibilityRole="button"
            accessibilityLabel="Send question"
            style={({ pressed }) => [
              styles.send,
              !canSend && styles.sendDisabled,
              pressed && styles.pressed,
            ]}
          >
            <ArrowUp size={20} color={color.textOnPrimary} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bgApp },
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 44,
    paddingHorizontal: space.s2,
    backgroundColor: color.card,
    borderBottomWidth: 1,
    borderBottomColor: color.borderSubtle,
  },
  back: { width: 36, alignItems: "center" },
  headerTitle: {
    fontSize: text.h3,
    fontFamily: font.sansBold,
    color: color.textStrong,
  },
  body: { padding: space.s4, gap: space.s5, flexGrow: 1 },

  empty: { alignItems: "center", gap: space.s3, paddingTop: space.s8 },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.primarySoft,
  },
  emptyTitle: {
    fontSize: text.h3,
    fontFamily: font.sansBold,
    color: color.textStrong,
    textAlign: "center",
  },
  emptyBody: {
    fontSize: text.bodyMd,
    fontFamily: font.sans,
    lineHeight: text.bodyMd * 1.5,
    color: color.textMuted,
    textAlign: "center",
  },
  suggestions: { gap: space.s2, alignSelf: "stretch", marginTop: space.s2 },
  suggestion: {
    backgroundColor: color.card,
    borderWidth: 1,
    borderColor: color.borderSubtle,
    borderRadius: radius.pill,
    paddingVertical: space.s3,
    paddingHorizontal: space.s4,
  },
  suggestionText: {
    fontSize: text.bodyMd,
    fontFamily: font.sansMedium,
    color: color.textBody,
    textAlign: "center",
  },

  turn: { gap: space.s3 },
  question: {
    alignSelf: "flex-end",
    maxWidth: "85%",
    backgroundColor: color.p500,
    borderRadius: radius.lg,
    paddingVertical: space.s3,
    paddingHorizontal: space.s4,
  },
  questionText: {
    fontSize: text.bodyMd,
    fontFamily: font.sansMedium,
    color: color.textOnPrimary,
  },
  answer: {
    backgroundColor: color.card,
    borderWidth: 1,
    borderColor: color.borderSubtle,
    borderRadius: radius.lg,
    padding: space.s4,
    ...shadow.xs,
  },
  answerText: {
    fontSize: text.bodyMd,
    fontFamily: font.sans,
    lineHeight: text.bodyMd * 1.5,
    color: color.textBody,
  },
  sources: { gap: space.s2 },
  sourcesLabel: {
    fontSize: text.xs,
    fontFamily: font.sansExtraBold,
    letterSpacing: 0.8,
    color: color.textMuted,
  },

  thinking: { flexDirection: "row", alignItems: "center", gap: space.s3 },
  thinkingText: {
    fontSize: text.sm,
    fontFamily: font.sansMedium,
    color: color.textMuted,
  },
  errorBox: {
    backgroundColor: color.alertBg,
    borderRadius: radius.md,
    padding: space.s4,
  },
  errorText: {
    fontSize: text.sm,
    fontFamily: font.sansMedium,
    color: color.alert,
  },

  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: space.s2,
    paddingHorizontal: space.s4,
    paddingTop: space.s3,
    backgroundColor: color.card,
    borderTopWidth: 1,
    borderTopColor: color.borderSubtle,
  },
  input: {
    flex: 1,
    maxHeight: 120,
    backgroundColor: color.sunken,
    borderRadius: radius.lg,
    paddingHorizontal: space.s4,
    paddingTop: space.s3,
    paddingBottom: space.s3,
    fontSize: text.bodyMd,
    fontFamily: font.sans,
    color: color.textBody,
  },
  send: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.p500,
  },
  sendDisabled: { backgroundColor: color.n400 },
  pressed: { opacity: 0.85 },
});
