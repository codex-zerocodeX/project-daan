import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import Constants, { ExecutionEnvironment } from "expo-constants";
import { MapPin } from "lucide-react-native";
import { EXAMPLE_ROUTE, MANILA_CENTER, OSM_RASTER_STYLE } from "../lib/mapStyle";
import { color, font, radius, text } from "../lib/theme";

// MapLibre is native code, so it cannot load inside Expo Go (which ships a
// fixed set of native modules). Importing it there throws at module load and
// takes the whole app down on launch. Detect Expo Go first, then require
// lazily, so the rest of the app -- search, threads, compose, ask -- stays
// fully usable in Expo Go. A dev build still gets the real map.
const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

type MapLibreModule = typeof import("@maplibre/maplibre-react-native");

const maplibre: MapLibreModule | null = (() => {
  if (isExpoGo) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("@maplibre/maplibre-react-native") as MapLibreModule;
    // A missing native module can yield an object without the components. The
    // types claim Map is always present, so probe it as plain data instead.
    const exports = mod as unknown as Record<string, unknown>;
    return exports?.Map ? mod : null;
  } catch {
    return null;
  }
})();

// Data-driven styling: line color interpolates red->yellow->green from each
// segment's walkability property. Real walkability data reuses this exact layer.
const routeLineStyle = {
  lineWidth: 4,
  lineCap: "round",
  lineJoin: "round",
  lineColor: [
    "interpolate",
    ["linear"],
    ["get", "walkability"],
    0,
    "#d73027",
    50,
    "#fee08b",
    100,
    "#1a9850",
  ],
} as const;

export function KomyutMap() {
  useEffect(() => {
    if (!maplibre) return;
    Location.requestForegroundPermissionsAsync();
  }, []);

  if (!maplibre) return <MapUnavailable />;

  const { Camera, GeoJSONSource, Layer, Map: MapView, UserLocation } = maplibre;

  return (
    <MapView style={styles.map} mapStyle={OSM_RASTER_STYLE}>
      <Camera initialViewState={{ center: MANILA_CENTER, zoom: 11 }} />
      <UserLocation />
      <GeoJSONSource id="example-route" data={EXAMPLE_ROUTE}>
        <Layer id="example-route-line" type="line" style={routeLineStyle as never} />
      </GeoJSONSource>
    </MapView>
  );
}

/** Shown in Expo Go, where the native map cannot load. Everything else works. */
function MapUnavailable() {
  return (
    <View style={styles.fallback}>
      <View style={styles.badge}>
        <MapPin size={18} color={color.p500} />
      </View>
      <Text style={styles.title}>Map needs a dev build</Text>
      <Text style={styles.body}>
        MapLibre is native code and can&apos;t run in Expo Go. Search, threads and
        routes all work here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  fallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 32,
    backgroundColor: color.sunken,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.primarySoft,
  },
  title: {
    fontSize: text.bodyMd,
    fontFamily: font.sansBold,
    color: color.textStrong,
  },
  body: {
    fontSize: text.sm,
    fontFamily: font.sansMedium,
    color: color.textMuted,
    textAlign: "center",
    lineHeight: text.sm * 1.4,
  },
});
