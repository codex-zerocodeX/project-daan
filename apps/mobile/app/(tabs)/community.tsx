import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { ThreadCard } from "../../src/components/ThreadCard";
import { Button } from "../../src/components/ui/Button";
import { useThreads } from "../../src/hooks/useThreads";
import { color, font, text } from "../../src/lib/theme";

export default function CommunityScreen() {
  const { data, error, isPending, isRefetching, refetch } = useThreads();

  if (isPending) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={color.p500} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Could not load threads: {error.message}
        </Text>
        <Button variant="outline" onPress={() => refetch()}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(t) => t.id}
      renderItem={({ item }) => <ThreadCard thread={item} />}
      refreshing={isRefetching}
      onRefresh={() => refetch()}
      style={styles.screen}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={styles.emptyText}>
            No threads yet. Be the first to post a route!
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: color.bgApp },
  list: { padding: 16, gap: 12, flexGrow: 1 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
    backgroundColor: color.bgApp,
  },
  errorText: {
    color: color.alert,
    fontFamily: font.sansMedium,
    fontSize: text.bodyMd,
    textAlign: "center",
  },
  emptyText: {
    color: color.textMuted,
    fontFamily: font.sansMedium,
    fontSize: text.bodyMd,
    textAlign: "center",
  },
});
