"use client";
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getTemplates, getGroups, Template } from "@/lib/data";
import { PLACE_TYPE_LABELS, formatCount, GROUP_CONFIG } from "@/lib/utils";
import GroupBadge from "@/components/GroupBadge";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

type GroupId = keyof typeof GROUP_CONFIG;

const PLACE_TYPES = Object.entries(PLACE_TYPE_LABELS).slice(0, 6);

const GROUP_GRADIENTS: Record<string, string> = {
  bts: "from-[#ede8f8] to-[#d8ccf0]",
  blackpink: "from-[#fde0f0] to-[#f5b8d8]",
  aespa: "from-[#c3faf5] to-[#9aeee8]",
};

export default function MapPage() {
  const allTemplates = getTemplates();
  const groups = getGroups();
  const [activeGroup, setActiveGroup] = useState("all");
  const [activeType, setActiveType] = useState("all");
  const [selected, setSelected] = useState<Template | null>(null);

  const filtered = useMemo(() => {
    return allTemplates.filter((t) => {
      const groupMatch = activeGroup === "all" || t.group_id === activeGroup;
      const typeMatch = activeType === "all" || t.place_type === activeType;
      return groupMatch && typeMatch;
    });
  }, [allTemplates, activeGroup, activeType]);

  return (
    <div className="min-h-screen bg-canvas">
      {/* Page header */}
      <div className="border-b border-hairline-soft bg-canvas">
        <div className="section-container py-6">
          <h1 className="text-heading-2 text-ink mb-1">圣地巡礼地图</h1>
          <p className="text-sm text-steel">{filtered.length} 个同款地点 · BTS / BLACKPINK / aespa</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="sticky top-[105px] z-20 bg-canvas/95 backdrop-blur border-b border-hairline-soft">
        <div className="section-container py-3 space-y-2">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button onClick={() => setActiveGroup("all")} className={`pill-tab flex-shrink-0 ${activeGroup === "all" ? "active" : ""}`}>
              全部团体
            </button>
            {groups.map((g) => (
              <button key={g.id} onClick={() => setActiveGroup(g.id)} className={`pill-tab flex-shrink-0 ${activeGroup === g.id ? "active" : ""}`}>
                {g.name}
              </button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button onClick={() => setActiveType("all")} className={`pill-tab flex-shrink-0 text-xs py-1.5 px-3 ${activeType === "all" ? "active" : ""}`}>
              全部类型
            </button>
            {PLACE_TYPES.map(([type, label]) => (
              <button key={type} onClick={() => setActiveType(type)} className={`pill-tab flex-shrink-0 text-xs py-1.5 px-3 ${activeType === type ? "active" : ""}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="section-container py-6">
        <div className="flex flex-col lg:flex-row gap-6" style={{ minHeight: "calc(100vh - 280px)" }}>

          {/* Left: template list */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="space-y-3 lg:max-h-[calc(100vh-280px)] lg:overflow-y-auto lg:pr-2">
              {filtered.length === 0 && (
                <div className="text-center py-16 text-steel text-sm">没有找到符合条件的地点</div>
              )}
              {filtered.map((t) => {
                const gradient = GROUP_GRADIENTS[t.group_id] ?? "from-[#f0f0f0] to-[#e0e0e0]";
                const config = GROUP_CONFIG[t.group_id as GroupId];
                const isSelected = selected?.template_id === t.template_id;
                return (
                  <div
                    key={t.template_id}
                    onClick={() => setSelected(isSelected ? null : t)}
                    className={`rounded-2xl border overflow-hidden cursor-pointer transition-all ${
                      isSelected ? "border-ink shadow-card" : "border-hairline-soft hover:border-hairline-strong hover:shadow-subtle"
                    }`}
                  >
                    <div className={`h-24 bg-gradient-to-br ${gradient} relative flex items-end p-3`}>
                      <GroupBadge groupId={t.group_id} idolName={t.idol_name ?? undefined} size="sm" />
                      <div className="absolute top-3 right-3 w-10 h-10 rounded-full opacity-25" style={{ backgroundColor: config?.color }} />
                    </div>
                    <div className="bg-canvas p-4">
                      <p className="text-xs font-mono uppercase tracking-wider text-stone mb-1">{PLACE_TYPE_LABELS[t.place_type]}</p>
                      <p className="font-semibold text-ink text-sm mb-0.5">{t.place_name_cn}</p>
                      <p className="text-xs text-steel mb-3">{t.district} · {t.city}</p>
                      <p className="text-xs text-slate line-clamp-2 mb-3">{t.spot_reason}</p>
                      <div className="flex items-center gap-3 text-xs text-stone">
                        <span>💫 {formatCount(t.social_stats.generation_count)}</span>
                        <span>❤️ {formatCount(t.social_stats.save_count)}</span>
                      </div>
                      {isSelected && (
                        <div className="mt-3 flex gap-2">
                          <Link
                            href={`/template/${t.template_id}`}
                            className="flex-1 text-center py-2 rounded-full bg-ink text-white text-xs font-medium hover:bg-charcoal transition-colors"
                          >
                            查看详情
                          </Link>
                          <Link
                            href={`/generate?template=${t.template_id}`}
                            className="flex-1 text-center py-2 rounded-full border border-hairline-strong text-ink text-xs font-medium hover:bg-surface transition-colors"
                          >
                            ✨ 生成同款
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: real Mapbox map */}
          <div className="flex-1 min-h-[500px] lg:min-h-0">
            <MapView templates={filtered} selected={selected} onSelect={setSelected} />
          </div>
        </div>
      </div>
    </div>
  );
}
