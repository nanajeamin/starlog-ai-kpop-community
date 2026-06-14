import Link from "next/link";
import { Template } from "@/lib/data";
import { GROUP_CONFIG, PLACE_TYPE_LABELS } from "@/lib/utils";
import GroupBadge from "./GroupBadge";

type GroupId = keyof typeof GROUP_CONFIG;

interface MapPlaceholderProps {
  templates: Template[];
  onSelect?: (t: Template) => void;
}

const GROUP_GRADIENTS: Record<string, string> = {
  bts: "from-[#ede8f8] to-[#d8ccf0]",
  blackpink: "from-[#fde0f0] to-[#f5b8d8]",
  aespa: "from-[#c3faf5] to-[#9aeee8]",
};

export default function MapPlaceholder({ templates, onSelect }: MapPlaceholderProps) {
  return (
    <div className="relative w-full h-full min-h-[400px] bg-surface rounded-3xl overflow-hidden">
      {/* Warning banner */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-[#fff4c4] border-b border-[#e0d08c] px-4 py-2.5 flex items-center gap-2 text-sm">
        <span>⚠️</span>
        <span className="text-[#746019] font-medium text-xs">
          配置 <code className="font-mono bg-[#ffeab0] px-1 rounded">NEXT_PUBLIC_MAPBOX_TOKEN</code> 以启用完整地图功能
        </span>
      </div>

      {/* SVG Seoul map placeholder */}
      <div className="absolute inset-0 flex items-center justify-center pt-10">
        <svg viewBox="0 0 400 300" className="w-full h-full opacity-10" fill="none">
          <path d="M50 150 Q100 50 200 80 Q300 110 350 150 Q380 200 300 220 Q200 250 100 220 Q20 200 50 150Z" stroke="#1c1c1e" strokeWidth="2" fill="#f0f0f0"/>
          <path d="M100 120 Q150 80 200 100 Q250 120 280 150 Q300 180 250 200 Q200 220 150 200 Q100 180 100 120Z" stroke="#1c1c1e" strokeWidth="1" fill="#e8e8e8"/>
          <path d="M80 160 Q200 160 320 160" stroke="#c7cad5" strokeWidth="1" strokeDasharray="4 4"/>
          <path d="M200 80 Q200 160 200 240" stroke="#c7cad5" strokeWidth="1" strokeDasharray="4 4"/>
          <text x="200" y="155" textAnchor="middle" fontSize="12" fill="#8e91a0">首尔 Seoul</text>
          <text x="140" y="130" textAnchor="middle" fontSize="8" fill="#a5a8b5">성수동</text>
          <text x="220" y="120" textAnchor="middle" fontSize="8" fill="#a5a8b5">강남</text>
          <text x="170" y="175" textAnchor="middle" fontSize="8" fill="#a5a8b5">한남동</text>
          <text x="130" y="165" textAnchor="middle" fontSize="8" fill="#a5a8b5">홍대</text>
        </svg>
      </div>

      {/* Template grid */}
      <div className="absolute inset-0 pt-14 overflow-y-auto">
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {templates.map((t) => {
            const config = GROUP_CONFIG[t.group_id as GroupId];
            const gradient = GROUP_GRADIENTS[t.group_id] ?? "from-[#f0f0f0] to-[#e0e0e0]";
            return (
              <div
                key={t.template_id}
                className="bg-canvas rounded-2xl border border-hairline-soft overflow-hidden cursor-pointer hover:shadow-card transition-shadow"
                onClick={() => onSelect?.(t)}
              >
                <div className={`h-20 bg-gradient-to-br ${gradient} relative flex items-end p-3`}>
                  <GroupBadge groupId={t.group_id} idolName={t.idol_name ?? undefined} size="sm" />
                  <div
                    className="absolute top-3 right-3 w-10 h-10 rounded-full opacity-30"
                    style={{ backgroundColor: config?.color }}
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-ink line-clamp-1">{t.place_name_cn}</p>
                  <p className="text-xs text-steel mt-0.5">{t.district} · {PLACE_TYPE_LABELS[t.place_type]}</p>
                  <Link
                    href={`/template/${t.template_id}`}
                    className="mt-2 text-xs text-brand-blue font-medium hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    查看详情 →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
