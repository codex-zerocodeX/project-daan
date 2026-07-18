import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { ThreadCard } from "../../src/components/ThreadCard";
import { useThreads } from "../../src/hooks/useThreads";

export default function CommunityScreen() {
  const { data, error, isPending, isRefetching, refetch } = useThreads();

  if (isPending) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Could not load threads: {error.message}</Text>
        <Pressable style={styles.retry} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
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
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={styles.emptyText}>No threads yet. Be the first to post a route!</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: { paddingVertical: 10, flexGrow: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  errorText: { color: "#c0392b", textAlign: "center", marginBottom: 12 },
  retry: { backgroundColor: "#0a7ea4", borderRadius: 8, paddingHorizontal: 20, paddingVertical: 10 },
  retryText: { color: "#fff", fontWeight: "600" },
  emptyText: { color: "#777", textAlign: "center" },
});
