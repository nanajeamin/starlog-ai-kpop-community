import { notFound } from "next/navigation";
import Link from "next/link";
import { getTemplateById, getPosts } from "@/lib/data";
import { PLACE_TYPE_LABELS, formatCount, GROUP_CONFIG } from "@/lib/utils";
import GroupBadge from "@/components/GroupBadge";

type GroupId = keyof typeof GROUP_CONFIG;

const GROUP_GRADIENTS: Record<string, string> = {
  bts: "from-[#ede8f8] to-[#d8ccf0]",
  blackpink: "from-[#fde0f0] to-[#f5b8d8]",
  aespa: "from-[#c3faf5] to-[#9aeee8]",
};

export default function TemplateDetailPage({ params }: { params: { id: string } }) {
  const template = getTemplateById(params.id);
  if (!template) notFound();

  const relatedPosts = getPosts(template.group_id).slice(0, 6);
  const gradient = GROUP_GRADIENTS[template.group_id] ?? "from-[#f0f0f0] to-[#e0e0e0]";
  const config = GROUP_CONFIG[template.group_id as GroupId];

  const allTags = [
    ...template.composition_tags.map((t) => ({ tag: t, type: "构图" })),
    ...template.style_tags.map((t) => ({ tag: t, type: "色调" })),
    ...template.pose_tags.map((t) => ({ tag: t, type: "姿势" })),
  ];

  const TAG_COLORS: Record<string, string> = {
    "构图": "bg-block-lilac text-[#6B3FA0]",
    "色调": "bg-block-teal text-[#007A92]",
    "姿势": "bg-block-rose text-[#B01569]",
  };

  return (
    <div className="min-h-screen bg-canvas">
      {/* Back nav */}
      <div className="border-b border-hairline-soft bg-canvas sticky top-[105px] z-10">
        <div className="section-container py-3 flex items-center gap-4">
          <Link href="/map" className="text-sm text-steel hover:text-ink flex items-center gap-1">
            ← 返回地图
          </Link>
          <span className="text-hairline-strong">|</span>
          <span className="text-sm text-ink font-medium line-clamp-1">{template.place_name_cn}</span>
        </div>
      </div>

      <div className="section-container py-8 max-w-3xl mx-auto">
        {/* Hero image */}
        <div className={`w-full aspect-video bg-gradient-to-br ${gradient} rounded-3xl relative overflow-hidden mb-8`}>
          <div
            className="absolute top-6 right-6 w-32 h-32 rounded-full opacity-20"
            style={{ backgroundColor: config?.color }}
          />
          <div
            className="absolute bottom-8 left-8 w-16 h-16 rounded-full opacity-15"
            style={{ backgroundColor: config?.color }}
          />
          <div className="absolute bottom-5 left-5 flex gap-2">
            <GroupBadge groupId={template.group_id} idolName={template.idol_name ?? undefined} />
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/80 text-ink">
              📍 {template.district}
            </span>
          </div>
          <div className="absolute top-4 right-4 text-xs font-mono text-white/60 bg-black/20 px-2 py-1 rounded-full">
            参考场景（抽象描述）
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-8xl opacity-10">★</span>
          </div>
        </div>

        {/* Title block */}
        <div className="mb-8">
          <h1 className="text-heading-1 text-ink mb-2">{template.place_name_cn}</h1>
          <p className="text-base text-steel mb-1">{template.place_name_kr} / {template.place_name_en}</p>
          <p className="text-sm text-stone">{template.address}</p>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-3 gap-4 mb-8 p-5 bg-surface rounded-2xl">
          <div>
            <p className="text-eyebrow mb-1">区域</p>
            <p className="text-sm font-medium text-ink">{template.district}</p>
          </div>
          <div>
            <p className="text-eyebrow mb-1">类型</p>
            <p className="text-sm font-medium text-ink">{PLACE_TYPE_LABELS[template.place_type]}</p>
          </div>
          <div>
            <p className="text-eyebrow mb-1">来源</p>
            <p className="text-sm font-medium text-ink">
              {template.source_type === "official" ? "官方" : template.source_type === "fan_article" ? "粉丝攻略" : "用户投稿"}
            </p>
          </div>
        </div>

        {/* Spot reason */}
        <div className="bg-block-yellow rounded-3xl p-7 mb-6">
          <h2 className="text-heading-3 text-ink mb-3">🌟 为什么值得打卡</h2>
          <p className="text-base text-slate leading-relaxed">{template.spot_reason}</p>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <h2 className="text-heading-3 text-ink mb-4">同款构图 · 色调 · 姿势</h2>
          <div className="flex flex-wrap gap-2">
            {allTags.map(({ tag, type }) => (
              <span
                key={`${type}-${tag}`}
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${TAG_COLORS[type]}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Photo tips */}
        <div className="bg-block-teal rounded-3xl p-7 mb-6">
          <h2 className="text-heading-3 text-ink mb-3">📸 拍照建议</h2>
          <p className="text-base text-slate leading-relaxed">{template.photo_tips}</p>
        </div>

        {/* Risk notes */}
        <div className="border border-hairline rounded-2xl p-5 mb-8">
          <h3 className="text-sm font-semibold text-ink flex items-center gap-2 mb-2">
            <span>⚠️</span> 风险提示
          </h3>
          <p className="text-sm text-slate">{template.risk_notes}</p>
        </div>

        {/* Social stats */}
        <div className="grid grid-cols-4 gap-4 mb-10 py-6 border-y border-hairline-soft">
          {[
            { label: "生成同款", value: template.social_stats.generation_count, icon: "✨" },
            { label: "已收藏", value: template.social_stats.save_count, icon: "❤️" },
            { label: "打卡", value: template.social_stats.checkin_count, icon: "📍" },
            { label: "帖子", value: template.social_stats.post_count, icon: "💬" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-xl mb-1">{s.icon}</p>
              <p className="font-semibold text-ink text-lg">{formatCount(s.value)}</p>
              <p className="text-xs text-stone">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Community posts */}
        <div className="mb-10">
          <h2 className="text-heading-3 text-ink mb-5">同款广场 · 相关帖子</h2>
          <div className="grid grid-cols-3 gap-3">
            {relatedPosts.map((post) => (
              <div key={post.post_id} className="rounded-2xl overflow-hidden border border-hairline-soft">
                <div
                  className="aspect-square flex items-center justify-center"
                  style={{ backgroundColor: post.bg_color }}
                >
                  <span className="text-3xl opacity-20">★</span>
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium text-ink line-clamp-1">{post.username}</p>
                  <div className="flex gap-2 text-xs text-stone mt-1">
                    <span>❤️ {formatCount(post.likes)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/plaza" className="block text-center mt-4 text-sm text-steel hover:text-ink">
            查看全部同款 →
          </Link>
        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-canvas border-t border-hairline-soft p-4 z-30">
        <div className="max-w-3xl mx-auto flex gap-3">
          <Link
            href={`/route?add=${template.template_id}`}
            className="flex-1 text-center py-3.5 rounded-full border border-hairline-strong text-ink text-sm font-medium hover:bg-surface transition-colors"
          >
            ＋ 加入路线
          </Link>
          <Link
            href={`/generate?template=${template.template_id}`}
            className="flex-1 text-center py-3.5 rounded-full bg-ink text-white text-sm font-medium hover:bg-charcoal transition-colors"
          >
            ✨ 生成我的同款
          </Link>
        </div>
      </div>

      {/* Spacer for fixed bar */}
      <div className="h-24" />
    </div>
  );
}
