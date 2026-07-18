import { useEffect } from "react";
import { StyleSheet } from "react-native";
import * as Location from "expo-location";
// The installed @maplibre/maplibre-react-native (v11) renamed the v10-era
// component API: MapView -> Map, ShapeSource -> GeoJSONSource, LineLayer ->
// Layer (with a `type` prop). Map is aliased to MapView locally to avoid
// shadowing the global `Map` constructor and to keep this file's JSX close
// to the brief's intent.
import {
  Camera,
  GeoJSONSource,
  Layer,
  Map as MapView,
  UserLocation,
} from "@maplibre/maplibre-react-native";
import { EXAMPLE_ROUTE, MANILA_CENTER, OSM_RASTER_STYLE } from "../lib/mapStyle";

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

export function DaanMap() {
  useEffect(() => {
    Location.requestForegroundPermissionsAsync();
  }, []);

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

const styles = StyleSheet.create({
  map: { flex: 1 },
});
