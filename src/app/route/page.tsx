import Link from "next/link";
import { getRouteClusters } from "@/lib/data";
import { GROUP_CONFIG, PLACE_TYPE_LABELS } from "@/lib/utils";
import GroupBadge from "@/components/GroupBadge";

type GroupId = keyof typeof GROUP_CONFIG;

const GROUP_GRADIENTS: Record<string, string> = {
  bts: "from-[#ede8f8] to-[#d8ccf0]",
  blackpink: "from-[#fde0f0] to-[#f5b8d8]",
  aespa: "from-[#c3faf5] to-[#9aeee8]",
};

const CLUSTER_BADGES: Record<string, { icon: string; time: string; distance: string }> = {
  "성수동 카페 투어": { icon: "☕", time: "约 3 小时", distance: "2.1km" },
  "한남동 럭셔리 투어": { icon: "👜", time: "约 4 小时", distance: "3.5km" },
  "강남 K-POP 투어": { icon: "🏢", time: "约 5 小时", distance: "6.2km" },
  "홍대 스트릿 투어": { icon: "🌃", time: "约 3 小时", distance: "2.8km" },
  "한강 선셋 투어": { icon: "🌅", time: "约 2 小时", distance: "1.5km" },
  "청담동 럭셔리 투어": { icon: "💅", time: "约 3 小시", distance: "2.0km" },
  "이태원 아트 투어": { icon: "🎨", time: "约 4 小시", distance: "3.0km" },
  "합정 아트 투어": { icon: "🖼️", time: "약 2 小时", distance: "1.8km" },
  "북촌 문화 투어": { icon: "🏯", time: "约 3 小时", distance: "2.5km" },
  "이태원 선셋 투어": { icon: "🌇", time: "约 2 小时", distance: "1.2km" },
  "종로 역사 투어": { icon: "🏛️", time: "约 4 小时", distance: "4.0km" },
  "압구정 패션 투어": { icon: "👗", time: "约 3 小时", distance: "2.3km" },
  "宁宁首尔巡礼路线": { icon: "✨", time: "约 5 小时", distance: "8.5km" },
};

export default function RoutePage() {
  const clusters = getRouteClusters();

  return (
    <div className="min-h-screen bg-canvas">
      {/* Header */}
      <div className="border-b border-hairline-soft">
        <div className="section-container py-8">
          <p className="text-eyebrow mb-3">智能路线规划</p>
          <h1 className="text-heading-1 text-ink mb-3">首尔爱豆巡礼路线</h1>
          <p className="text-base text-steel max-w-xl">
            按区域聚合的同款打卡路线，步行友好 + 拍照攻略 + 时间预估，一键规划首尔巡礼行程
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-block-lilac">
        <div className="section-container py-10">
          <h2 className="text-heading-3 text-ink mb-6">路线规划怎么用？</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { step: "1", title: "选择路线", desc: "从下方选择你感兴趣的区域巡礼路线" },
              { step: "2", title: "查看地点", desc: "每条路线包含 2-4 个同款打卡地点，带时间安排" },
              { step: "3", title: "生成同款", desc: "到达地点后生成你的同款打卡照，晒到广场" },
            ].map((s) => (
              <div key={s.step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {s.step}
                </div>
                <div>
                  <p className="font-semibold text-ink mb-1">{s.title}</p>
                  <p className="text-sm text-slate">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Route clusters */}
      <div className="section-container py-12">
        <h2 className="text-heading-2 text-ink mb-8">精选巡礼路线</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(clusters).map(([clusterName, templates]) => {
            const info = CLUSTER_BADGES[clusterName] ?? { icon: "📍", time: "约 3 小时", distance: "2km" };
            const groupIds = Array.from(new Set(templates.map((t) => t.group_id)));

            return (
              <div key={clusterName} className="rounded-3xl border border-hairline-soft overflow-hidden hover:shadow-card transition-shadow">
                {/* Cluster header */}
                <div className={`p-6 bg-gradient-to-br ${GROUP_GRADIENTS[groupIds[0]] ?? "from-[#f0f0f0] to-[#e0e0e0]"}`}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{info.icon}</span>
                    <div className="flex gap-2">
                      {groupIds.map((gid) => (
                        <GroupBadge key={gid} groupId={gid} size="sm" />
                      ))}
                    </div>
                  </div>
                  <h3 className="text-heading-3 text-ink mb-1">{clusterName}</h3>
                  <div className="flex items-center gap-4 text-sm text-steel">
                    <span>⏱️ {info.time}</span>
                    <span>🚶 {info.distance}</span>
                    <span>📍 {templates.length} 个地点</span>
                  </div>
                </div>

                {/* Stops timeline */}
                <div className="bg-canvas p-5">
                  <div className="space-y-3 mb-5">
                    {templates.map((t, idx) => {
                      const config = GROUP_CONFIG[t.group_id as GroupId];
                      return (
                        <div key={t.template_id} className="flex gap-3 items-start">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
                            style={{ backgroundColor: config?.color ?? "#888" }}
                          >
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <Link href={`/template/${t.template_id}`} className="font-medium text-sm text-ink hover:text-brand-blue transition-colors">
                              {t.place_name_cn}
                            </Link>
                            <p className="text-xs text-steel">
                              {t.idol_name ? `${t.group_name} · ${t.idol_name}` : t.group_name} · {PLACE_TYPE_LABELS[t.place_type]}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href="/map"
                      className="flex-1 text-center py-2.5 rounded-full border border-hairline-strong text-ink text-sm font-medium hover:bg-surface transition-colors"
                    >
                      在地图查看
                    </Link>
                    <Link
                      href="/generate"
                      className="flex-1 text-center py-2.5 rounded-full bg-ink text-white text-sm font-medium hover:bg-charcoal transition-colors"
                    >
                      ✨ 生成同款
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom route CTA */}
      <div className="section-container pb-16">
        <div className="bg-block-coral rounded-3xl p-10 text-center">
          <h2 className="text-heading-2 text-ink mb-3">想要定制路线？</h2>
          <p className="text-base text-slate mb-6">
            先在地图页挑选你想去的地点，加入收藏，我们帮你自动规划最优路线
          </p>
          <Link
            href="/map"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-ink text-white text-sm font-medium hover:bg-charcoal transition-colors"
          >
            🗺️ 去地图挑选地点
          </Link>
        </div>
      </div>
    </div>
  );
}
