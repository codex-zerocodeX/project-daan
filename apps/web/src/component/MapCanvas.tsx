import type { Feature, FeatureCollection, LineString, Point } from "geojson";
import maplibregl, { type GeoJSONSource, type LayerSpecification, type Map as MapLibreMap } from "maplibre-gl";
import { MapPin, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { routeGraph } from "../fixture/network";
import {
  emptyFeatureCollection,
  mapStyleUrl,
  nodeHaloLayer,
  nodeLayerId,
  nodePointLayer,
  nodeSourceId,
  routeLineLayer,
  routeSourceId,
} from "../lib/map-style";
import type { PlaceNode, RouteAlternative } from "../lib/type";

interface MapCanvasProps {
  alternative: RouteAlternative | null;
  selectedNodeId: string | null;
  onNodeSelect: (nodeId: string) => void;
}

function routeFeature(alternative: RouteAlternative | null): FeatureCollection<LineString> {
  if (!alternative) return emptyFeatureCollection;
  const nodeById = new Map(routeGraph.node.map((node) => [node.nodeId, node]));
  const edgeById = new Map(routeGraph.edge.map((edge) => [edge.edgeId, edge]));
  const feature: Feature<LineString>[] = alternative.path.edgeId.map((edgeId, index) => ({
    type: "Feature",
    properties: { edgeId, score: edgeById.get(edgeId)?.score ?? 50 },
    geometry: {
      type: "LineString",
      coordinates: [nodeById.get(alternative.path.nodeId[index])!.position, nodeById.get(alternative.path.nodeId[index + 1])!.position],
    },
  }));
  return { type: "FeatureCollection", features: feature };
}

function nodeFeature(node: PlaceNode[], routeNodeId: string[], selectedNodeId: string | null): FeatureCollection<Point> {
  const routeNode = new Set(routeNodeId);
  const feature: Feature<Point>[] = node.map((item) => ({
    type: "Feature",
    id: item.nodeId,
    properties: {
      nodeId: item.nodeId,
      name: item.name,
      isOnRoute: routeNode.has(item.nodeId),
      isSelected: selectedNodeId === item.nodeId,
    },
    geometry: { type: "Point", coordinates: item.position },
  }));
  return { type: "FeatureCollection", features: feature };
}

export function MapCanvas({ alternative, selectedNodeId, onNodeSelect }: MapCanvasProps) {
  const isForcedFailure = new URLSearchParams(window.location.search).get("map") === "fail";
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const onNodeSelectRef = useRef(onNodeSelect);
  const [isReady, setIsReady] = useState(false);
  const [isFailed, setIsFailed] = useState(isForcedFailure);
  const routeData = useMemo(() => routeFeature(alternative), [alternative]);
  const nodeData = useMemo(
    () => nodeFeature(routeGraph.node, alternative?.path.nodeId ?? [], selectedNodeId),
    [alternative, selectedNodeId],
  );

  useEffect(() => {
    onNodeSelectRef.current = onNodeSelect;
  }, [onNodeSelect]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (isForcedFailure) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: mapStyleUrl,
      center: [121.0737, 14.6348],
      zoom: 14.7,
      attributionControl: false,
    });
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    map.addControl(new maplibregl.AttributionControl({ compact: false }), "bottom-right");

    map.on("load", () => {
      map.addSource(routeSourceId, { type: "geojson", data: emptyFeatureCollection });
      map.addSource(nodeSourceId, { type: "geojson", data: emptyFeatureCollection });
      map.addLayer(routeLineLayer as LayerSpecification);
      map.addLayer(nodeHaloLayer as LayerSpecification);
      map.addLayer(nodePointLayer as LayerSpecification);
      map.on("click", nodeLayerId, (event) => {
        const nodeId = event.features?.[0]?.properties?.nodeId;
        if (typeof nodeId === "string") onNodeSelectRef.current(nodeId);
      });
      map.on("mouseenter", nodeLayerId, () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", nodeLayerId, () => {
        map.getCanvas().style.cursor = "";
      });
      setIsReady(true);
    });
    map.on("error", () => {
      if (!map.loaded()) setIsFailed(true);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [isForcedFailure]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isReady) return;
    (map.getSource(routeSourceId) as GeoJSONSource | undefined)?.setData(routeData);
    (map.getSource(nodeSourceId) as GeoJSONSource | undefined)?.setData(nodeData);
    if (!alternative || alternative.path.nodeId.length < 2) return;
    const nodeById = new Map(routeGraph.node.map((node) => [node.nodeId, node]));
    const bounds = new maplibregl.LngLatBounds();
    for (const nodeId of alternative.path.nodeId) bounds.extend(nodeById.get(nodeId)!.position);
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    map.fitBounds(bounds, { padding: 54, duration: isReducedMotion ? 0 : 260, maxZoom: 16.2 });
  }, [alternative, isReady, nodeData, routeData]);

  return (
    <section className="daan-map-shell relative overflow-hidden bg-surface" aria-label="Interactive route map">
      <div ref={containerRef} className="daan-map" />
      {!isReady && !isFailed && (
        <div className="absolute inset-0 grid place-items-center bg-paper/90 text-sm font-bold text-ink-soft">Loading route map…</div>
      )}
      {isFailed && (
        <div className="absolute inset-0 grid place-items-center bg-paper p-6 text-center">
          <div className="max-w-xs">
            <span className="mx-auto grid size-12 place-items-center rounded-card bg-surface text-harsh">
              <MapPin aria-hidden="true" />
            </span>
            <h2 className="mt-3 text-lg font-extrabold">The map tiles are unavailable</h2>
            <p className="mt-1 text-sm font-medium text-ink-soft">Search, route choices, place reviews, and the evidence receipt still work below.</p>
            <button type="button" onClick={() => window.location.reload()} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-chip bg-ink px-4 py-2 text-sm font-bold text-surface">
              <RotateCcw size={16} aria-hidden="true" /> Retry map
            </button>
          </div>
        </div>
      )}
      {alternative && (
        <div className="daan-map-hint pointer-events-none absolute rounded-chip bg-surface/95 px-3 py-1.5 text-[11px] font-extrabold shadow-soft">
          Tap a checkpoint for local context
        </div>
      )}
    </section>
  );
}
