import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ChevronLeft,
  MessageCirclePlus,
  Sparkles,
  TriangleAlert,
} from "lucide-react-native";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "../../src/components/ui/Button";
import { Pill } from "../../src/components/ui/Pill";
import { useThread, type Answer } from "../../src/hooks/useThread";
import { color, font, radius, shadow, text } from "../../src/lib/theme";

const CATEGORY_STYLE: Record<string, { bg: string; fg: string }> = {
  route: { bg: color.primarySoft, fg: color.p700 },
  terminal: { bg: color.warnBg, fg: color.warnFg },
  hazard: { bg: color.alertBg, fg: color.alert },
  walkability: { bg: color.goodBg, fg: color.good },
  general: { bg: color.sunken, fg: color.textMuted },
};

function categoryStyle(category: string) {
  return CATEGORY_STYLE[category] ?? CATEGORY_STYLE.general;
}

function AnswerCard({ answer, best }: { answer: Answer; best: boolean }) {
  return (
    <View style={styles.answerCard}>
      <View style={styles.answerHead}>
        <View style={styles.authorBlock}>
          <View style={styles.authorAvatar}>
            <Text style={styles.authorAvatarText}>
              {(answer.author?.username ?? "?").slice(0, 1).toUpperCase()}
            </Text>
          </View>
          <View style={styles.authorMeta}>
            <Text style={styles.authorName}>
              {answer.author?.username ?? "Unknown rider"}
            </Text>
            <Text style={styles.authorKarma}>
              {answer.author?.karma ?? 0} karma
            </Text>
          </View>
        </View>
        {best && (
          <Pill bg={color.goodBg} fg={color.good}>
            TOP ANSWER
          </Pill>
        )}
      </View>

      {answer.summary !== "" && (
        <Text style={styles.answerSummary}>{answer.summary}</Text>
      )}

      <View style={styles.steps}>
        {answer.nodes.map((node, i) => (
          <View key={node.id} style={styles.stepRow}>
            <View style={styles.stepRail}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>{node.seq + 1}</Text>
              </View>
              {i < answer.nodes.length - 1 && <View style={styles.stepLine} />}
            </View>
            <View
              style={[
                styles.stepBody,
                i < answer.nodes.length - 1 && styles.stepBodySpaced,
              ]}
            >
              <Text style={styles.stepLabel}>{node.label}</Text>
              {node.image_url && (
                <Image
                  source={{ uri: node.image_url }}
                  style={styles.stepImage}
                  contentFit="cover"
                />
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function ThreadDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = params.id;
  const { data: thread, isPending, isError, error, refetch } = useThread(id);

  const header = (
    <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
      >
        <ChevronLeft size={20} color={color.textBody} />
      </Pressable>
      <Text style={styles.headerTitle}>Thread</Text>
    </View>
  );

  if (isPending) {
    return (
      <View style={styles.container}>
        {header}
        <View style={styles.centered}>
          <ActivityIndicator color={color.p500} />
          <Text style={styles.centeredBody}>Loading this thread…</Text>
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        {header}
        <View style={styles.centered}>
          <TriangleAlert size={28} color={color.alert} />
          <Text style={styles.centeredTitle}>Could not load this thread</Text>
          <Text style={styles.centeredBody}>
            {error instanceof Error ? error.message : "Something went wrong."}
          </Text>
          <Button onPress={() => refetch()}>Retry</Button>
        </View>
      </View>
    );
  }

  if (!thread) {
    return (
      <View style={styles.container}>
        {header}
        <View style={styles.centered}>
          <TriangleAlert size={28} color={color.textMuted} />
          <Text style={styles.centeredTitle}>Thread not found</Text>
          <Text style={styles.centeredBody}>
            This thread may have been deleted by its author.
          </Text>
          <Button variant="outline" onPress={() => router.back()}>
            Go back
          </Button>
        </View>
      </View>
    );
  }

  const cat = categoryStyle(thread.category);
  const answers = thread.answers;

  return (
    <View style={styles.container}>
      {header}
      <ScrollView
        style={styles.sheet}
        contentContainerStyle={[
          styles.sheetContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.threadCard}>
          <Pill bg={cat.bg} fg={cat.fg}>
            {thread.category.toUpperCase()}
          </Pill>
          <Text style={styles.threadTitle}>{thread.title}</Text>
          <Text style={styles.threadBody}>{thread.body}</Text>
          {thread.image_url && (
            <Image
              source={{ uri: thread.image_url }}
              style={styles.threadImage}
              contentFit="cover"
            />
          )}
          <Text style={styles.threadAuthor}>
            Asked by {thread.author?.username ?? "Unknown rider"} ·{" "}
            {thread.author?.karma ?? 0} karma
          </Text>
        </View>

        <Text style={styles.sectionLabel}>
          {answers.length === 0
            ? "Answers"
            : `${answers.length} ${answers.length === 1 ? "answer" : "answers"}`}
        </Text>

        {answers.length === 0 ? (
          <View style={styles.emptyCard}>
            <Sparkles size={26} color={color.p500} />
            <Text style={styles.emptyTitle}>No answers yet</Text>
            <Text style={styles.emptyBody}>
              Nobody has shared a route for this trip yet. If you know the way,
              you would be the first to help.
            </Text>
            <Button
              full
              icon={<MessageCirclePlus size={18} color={color.textOnPrimary} />}
            >
              Answer this thread
            </Button>
          </View>
        ) : (
          answers.map((answer, i) => (
            <AnswerCard
              key={answer.id}
              answer={answer}
              best={i === 0 && answer.score > 0 && answers.length > 1}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.bgApp },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingBottom: 10,
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
  headerTitle: {
    fontSize: text.h3,
    fontFamily: font.sansBold,
    color: color.textStrong,
  },
  pressed: { opacity: 0.7 },

  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 32,
  },
  centeredTitle: {
    fontSize: text.h3,
    fontFamily: font.sansBold,
    color: color.textStrong,
    textAlign: "center",
  },
  centeredBody: {
    fontSize: text.bodyMd,
    fontFamily: font.sans,
    color: color.textMuted,
    textAlign: "center",
    lineHeight: text.bodyMd * 1.5,
  },

  sheet: { flex: 1 },
  sheetContent: { padding: 16, gap: 12 },
  threadCard: {
    backgroundColor: color.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: color.borderSubtle,
    padding: 18,
    gap: 8,
    ...shadow.card,
  },
  threadTitle: {
    fontSize: text.h2,
    fontFamily: font.sansExtraBold,
    color: color.textStrong,
    letterSpacing: -0.3,
  },
  threadBody: {
    fontSize: text.bodyMd,
    fontFamily: font.sans,
    lineHeight: text.bodyMd * 1.55,
    color: color.textBody,
  },
  threadImage: {
    height: 180,
    borderRadius: radius.md,
    marginTop: 4,
    backgroundColor: color.sunken,
  },
  threadAuthor: {
    fontSize: text.sm,
    fontFamily: font.sansMedium,
    color: color.textMuted,
    marginTop: 2,
  },

  sectionLabel: {
    fontSize: text.xs,
    fontFamily: font.sansBold,
    textTransform: "uppercase",
    letterSpacing: 0.44,
    color: color.textMuted,
    marginTop: 4,
  },

  emptyCard: {
    backgroundColor: color.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.borderSubtle,
    borderStyle: "dashed",
    padding: 22,
    gap: 8,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: text.h3,
    fontFamily: font.sansBold,
    color: color.textStrong,
  },
  emptyBody: {
    fontSize: text.bodyMd,
    fontFamily: font.sans,
    color: color.textMuted,
    textAlign: "center",
    lineHeight: text.bodyMd * 1.5,
    marginBottom: 4,
  },

  answerCard: {
    backgroundColor: color.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.borderSubtle,
    padding: 16,
    gap: 12,
    ...shadow.xs,
  },
  answerHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  authorBlock: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  authorAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: color.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  authorAvatarText: {
    fontFamily: font.sansBold,
    fontSize: text.bodyMd,
    color: color.p700,
  },
  authorMeta: { flex: 1 },
  authorName: {
    fontSize: text.bodyMd,
    fontFamily: font.sansSemiBold,
    color: color.textStrong,
  },
  authorKarma: {
    fontSize: text.xs,
    fontFamily: font.monoMedium,
    color: color.textMuted,
  },
  answerSummary: {
    fontSize: text.bodyMd,
    fontFamily: font.sansMedium,
    lineHeight: text.bodyMd * 1.5,
    color: color.textBody,
  },

  steps: { borderTopWidth: 1, borderTopColor: color.borderSubtle, paddingTop: 14 },
  stepRow: { flexDirection: "row", gap: 12 },
  stepRail: { alignItems: "center" },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: color.sunken,
    alignItems: "center",
    justifyContent: "center",
  },
  stepBadgeText: {
    fontFamily: font.monoMedium,
    fontSize: text.xs,
    color: color.textBody,
  },
  stepLine: {
    width: 2,
    flex: 1,
    minHeight: 18,
    backgroundColor: color.borderSubtle,
  },
  stepBody: { flex: 1, paddingTop: 3 },
  stepBodySpaced: { paddingBottom: 16 },
  stepLabel: {
    fontSize: text.bodyMd,
    fontFamily: font.sans,
    lineHeight: text.bodyMd * 1.45,
    color: color.textBody,
  },
  stepImage: {
    height: 150,
    borderRadius: radius.md,
    marginTop: 8,
    backgroundColor: color.sunken,
  },
});
