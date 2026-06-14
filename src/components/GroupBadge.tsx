import { cn, GROUP_CONFIG } from "@/lib/utils";

type GroupId = keyof typeof GROUP_CONFIG;

interface GroupBadgeProps {
  groupId: string;
  idolName?: string;
  size?: "sm" | "md";
  className?: string;
}

export default function GroupBadge({ groupId, idolName, size = "md", className }: GroupBadgeProps) {
  const config = GROUP_CONFIG[groupId as GroupId] ?? { name: groupId, bg: "#f0f0f0", text: "#666" };

  const text = idolName ? `${config.name} · ${idolName}` : config.name;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold",
        size === "sm" ? "text-xs px-2.5 py-0.5" : "text-xs px-3 py-1",
        className
      )}
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {text}
    </span>
  );
}
