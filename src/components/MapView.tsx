"use client";
import { useRef, useCallback } from "react";
import Map, { Marker, Popup, NavigationControl, MapRef } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Link from "next/link";
import { Template } from "@/lib/data";
import { GROUP_CONFIG, PLACE_TYPE_LABELS } from "@/lib/utils";
import GroupBadge from "./GroupBadge";

type GroupId = keyof typeof GROUP_CONFIG;

interface MapViewProps {
  templates: Template[];
  selected: Template | null;
  onSelect: (t: Template | null) => void;
}

const SEOUL_CENTER = { longitude: 127.0, latitude: 37.54, zoom: 11.5 };

export default function MapView({ templates, selected, onSelect }: MapViewProps) {
  const mapRef = useRef<MapRef>(null);

  const handleMarkerClick = useCallback((t: Template) => {
    onSelect(t);
    mapRef.current?.flyTo({
      center: [t.lng, t.lat],
      zoom: 14,
      duration: 800,
    });
  }, [onSelect]);

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-3xl overflow-hidden">
      <Map
        ref={mapRef}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={SEOUL_CENTER}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/light-v11"
      >
        <NavigationControl position="top-right" />

        {templates.map((t) => {
          const config = GROUP_CONFIG[t.group_id as GroupId];
          const isSelected = selected?.template_id === t.template_id;
          return (
            <Marker
              key={t.template_id}
              longitude={t.lng}
              latitude={t.lat}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                handleMarkerClick(t);
              }}
            >
              <div
                className={`flex items-center justify-center rounded-full text-white text-xs font-bold shadow-mockup transition-all cursor-pointer ${
                  isSelected ? "w-10 h-10 ring-2 ring-white ring-offset-1" : "w-8 h-8 hover:scale-110"
                }`}
                style={{ backgroundColor: config?.color ?? "#888" }}
                title={t.place_name_cn}
              >
                ★
              </div>
            </Marker>
          );
        })}

        {selected && (
          <Popup
            longitude={selected.lng}
            latitude={selected.lat}
            anchor="bottom"
            offset={44}
            onClose={() => onSelect(null)}
            closeButton={true}
            closeOnClick={false}
            className="kstar-popup"
          >
            <div className="p-3 min-w-[200px]">
              <div className="mb-2">
                <GroupBadge groupId={selected.group_id} idolName={selected.idol_name ?? undefined} size="sm" />
              </div>
              <p className="font-semibold text-ink text-sm mb-0.5">{selected.place_name_cn}</p>
              <p className="text-xs text-steel mb-3">{selected.district} · {PLACE_TYPE_LABELS[selected.place_type]}</p>
              <div className="flex gap-2">
                <Link
                  href={`/template/${selected.template_id}`}
                  className="flex-1 text-center py-1.5 rounded-full bg-ink text-white text-xs font-medium"
                >
                  查看详情
                </Link>
                <Link
                  href={`/generate?template=${selected.template_id}`}
                  className="flex-1 text-center py-1.5 rounded-full border border-hairline-strong text-ink text-xs font-medium"
                >
                  ✨ 生成
                </Link>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
