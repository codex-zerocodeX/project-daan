import { MessageSquarePlus } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { color, font, radius, text } from "../../lib/theme";
import { Button } from "../ui/Button";

type Props = {
  /** Weak or empty results - the ask becomes the main call to action. */
  prominent?: boolean;
  onPress: () => void;
};

export function AskPrompt({ prominent = false, onPress }: Props) {
  if (!prominent) {
    return (
      <View style={styles.quiet}>
        <Text style={styles.quietText}>Still not what you needed?</Text>
        <Button
          variant="outline"
          onPress={onPress}
          icon={<MessageSquarePlus size={16} color={color.textStrong} />}
        >
          Ask a question
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Ask the community</Text>
      <Text style={styles.body}>
        No one has answered this trip yet. Post it and commuters who know this
        route can reply.
      </Text>
      <Button
        size="lg"
        full
        onPress={onPress}
        icon={<MessageSquarePlus size={18} color={color.textOnPrimary} />}
      >
        Ask a question
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.primarySoft,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.p100,
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: text.h3,
    fontFamily: font.sansBold,
    color: color.p700,
  },
  body: {
    fontSize: text.bodyMd,
    fontFamily: font.sansMedium,
    lineHeight: text.bodyMd * 1.45,
    color: color.p700,
    marginBottom: 4,
  },
  quiet: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  quietText: {
    fontSize: text.sm,
    fontFamily: font.sansMedium,
    color: color.textMuted,
  },
});
