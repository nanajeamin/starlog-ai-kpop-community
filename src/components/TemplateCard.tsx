import Link from "next/link";
import { Template } from "@/lib/data";
import { cn, formatCount, GROUP_CONFIG, PLACE_TYPE_LABELS } from "@/lib/utils";
import GroupBadge from "./GroupBadge";

type GroupId = keyof typeof GROUP_CONFIG;

interface TemplateCardProps {
  template: Template;
  className?: string;
  compact?: boolean;
}

const GROUP_GRADIENTS: Record<string, string> = {
  bts: "from-[#ede8f8] to-[#d8ccf0]",
  blackpink: "from-[#fde0f0] to-[#f5b8d8]",
  aespa: "from-[#c3faf5] to-[#9aeee8]",
};

export default function TemplateCard({ template, className, compact = false }: TemplateCardProps) {
  const gradient = GROUP_GRADIENTS[template.group_id] ?? "from-[#f0f0f0] to-[#e0e0e0]";
  const config = GROUP_CONFIG[template.group_id as GroupId];

  return (
    <Link
      href={`/template/${template.template_id}`}
      className={cn(
        "block rounded-3xl border border-hairline-soft bg-canvas overflow-hidden hover:shadow-card transition-shadow duration-200",
        className
      )}
    >
      {/* Cover image placeholder — gradient */}
      <div className={cn("bg-gradient-to-br w-full relative", gradient, compact ? "h-32" : "h-48")}>
        <div className="absolute inset-0 flex flex-col justify-end p-4">
          <GroupBadge groupId={template.group_id} idolName={template.idol_name ?? undefined} />
        </div>
        {/* Decorative circles */}
        <div
          className="absolute top-4 right-4 w-16 h-16 rounded-full opacity-30"
          style={{ backgroundColor: config?.color ?? "#ccc" }}
        />
        <div
          className="absolute top-8 right-8 w-8 h-8 rounded-full opacity-20"
          style={{ backgroundColor: config?.color ?? "#ccc" }}
        />
      </div>

      {/* Content */}
      <div className={cn("p-5", compact && "p-4")}>
        <p className="text-eyebrow mb-1">{PLACE_TYPE_LABELS[template.place_type] ?? template.place_type}</p>
        <h3 className={cn("font-semibold text-ink line-clamp-1 mb-1", compact ? "text-sm" : "text-base")}>
          {template.place_name_cn}
        </h3>
        <p className="text-xs text-steel mb-3 line-clamp-1">
          {template.district} · {template.city}
        </p>

        {!compact && (
          <p className="text-sm text-slate line-clamp-2 mb-4">{template.spot_reason}</p>
        )}

        <div className="flex items-center gap-3 text-xs text-stone">
          <span>💫 {formatCount(template.social_stats.generation_count)} 人生成</span>
          <span>❤️ {formatCount(template.social_stats.save_count)} 收藏</span>
        </div>
      </div>
    </Link>
  );
}
