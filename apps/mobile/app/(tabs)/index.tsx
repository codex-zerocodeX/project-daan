import { StyleSheet, View } from "react-native";
import { KomyutMap } from "../../src/components/KomyutMap";

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <KomyutMap />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
