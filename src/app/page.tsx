import Link from "next/link";
import { getTopTemplates, getPosts } from "@/lib/data";
import TemplateCard from "@/components/TemplateCard";
import GroupBadge from "@/components/GroupBadge";
import { formatCount } from "@/lib/utils";

export default function HomePage() {
  const topTemplates = getTopTemplates(4);
  const posts = getPosts().slice(0, 6);

  const FEATURES = [
    {
      icon: "🗺️",
      title: "圣地巡礼地图",
      desc: "15+ 首尔爱豆同款打卡地点，一目了然，从圣水洞到汉南洞全覆盖",
      bg: "bg-block-teal",
      href: "/map",
    },
    {
      icon: "✨",
      title: "云同款生成",
      desc: "上传你的照片，AI 帮你合成爱豆同款打卡照，3步完成，无需去现场",
      bg: "bg-block-rose",
      href: "/generate",
    },
    {
      icon: "🛣️",
      title: "路线规划",
      desc: "一键生成最优巡礼路线，步行时间 + 打卡顺序 + 拍照攻略全搞定",
      bg: "bg-block-yellow",
      href: "/route",
    },
  ];

  const STATS = [
    { value: "3", unit: "个", label: "顶流团体" },
    { value: "15", unit: "+", label: "圣地模板" },
    { value: "5000", unit: "+", label: "粉丝生成" },
    { value: "100", unit: "%", label: "合规安全" },
  ];

  return (
    <>
      {/* ── Hero Section ─────────────────────────────── */}
      <section className="bg-canvas pt-20 pb-24">
        <div className="section-container text-center">
          <p className="text-eyebrow mb-6">K-STAR SPOT · AI POWERED</p>

          <h1 className="text-display text-ink mb-6">
            和爱豆同款<br />
            从打卡到云巡礼
          </h1>

          <p className="text-lg text-steel max-w-xl mx-auto mb-10 leading-relaxed">
            发现 15+ 首尔爱豆圣地，上传照片生成同款打卡照，
            <br className="hidden md:block" />
            和同好一起追星，晒你的同款故事
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link href="/map" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-ink text-white text-sm font-medium hover:bg-charcoal transition-colors">
              🗺️ 探索首尔同款地图
            </Link>
            <Link href="/generate" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-hairline-strong text-ink text-sm font-medium hover:border-ink hover:bg-surface transition-colors">
              ✨ 生成我的同款照
            </Link>
          </div>

          {/* Group chips */}
          <div className="mt-12 flex items-center justify-center gap-3 flex-wrap">
            {[
              { id: "bts", label: "BTS 방탄소년단" },
              { id: "blackpink", label: "BLACKPINK 블랙핑크" },
              { id: "aespa", label: "aespa 에스파" },
            ].map((g) => (
              <Link key={g.id} href={`/map?group=${g.id}`}>
                <GroupBadge groupId={g.id} size="md" className="text-sm px-4 py-2 cursor-pointer hover:opacity-80 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top Templates (lilac block) ─────────────── */}
      <section className="py-20">
        <div className="section-container">
          <div className="bg-block-lilac rounded-feature p-10 md:p-14">
            <p className="text-eyebrow mb-3">精选同款地点</p>
            <div className="flex items-end justify-between mb-8">
              <h2 className="text-heading-2 text-ink">同款模板热度榜</h2>
              <Link href="/map" className="text-sm text-steel hover:text-ink font-medium hidden md:block">
                查看全部 →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {topTemplates.map((t) => (
                <TemplateCard key={t.template_id} template={t} compact />
              ))}
            </div>
            <div className="mt-6 md:hidden">
              <Link href="/map" className="text-sm text-steel hover:text-ink font-medium">
                查看全部 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features (3-col pastel cards) ───────────── */}
      <section className="pb-20">
        <div className="section-container">
          <div className="text-center mb-12">
            <p className="text-eyebrow mb-3">三大核心功能</p>
            <h2 className="text-heading-2 text-ink">一站式爱豆同款体验</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <Link key={f.href} href={f.href} className="group block">
                <div className={`${f.bg} rounded-3xl p-8 h-full hover:shadow-card transition-shadow duration-200`}>
                  <div className="text-4xl mb-5">{f.icon}</div>
                  <h3 className="text-heading-3 text-ink mb-3">{f.title}</h3>
                  <p className="text-sm text-slate leading-relaxed mb-6">{f.desc}</p>
                  <span className="inline-flex items-center text-sm font-medium text-ink group-hover:gap-2 transition-all">
                    立即体验 <span className="ml-1">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats (dark block) ───────────────────────── */}
      <section className="py-20">
        <div className="section-container">
          <div className="bg-block-navy rounded-feature p-10 md:p-14">
            <p className="text-eyebrow text-white/50 mb-3">粉丝数据</p>
            <h2 className="text-heading-2 text-white mb-10">正在被更多粉丝发现</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="text-stat text-white">
                    {s.value}<span className="text-2xl">{s.unit}</span>
                  </p>
                  <p className="text-sm text-white/50 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link href="/map" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-ink text-sm font-medium hover:bg-surface transition-colors">
                🗺️ 开始探索
              </Link>
              <Link href="/plaza" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white text-sm font-medium hover:border-white/50 transition-colors">
                👀 逛同款广场
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Community preview ────────────────────────── */}
      <section className="py-20">
        <div className="section-container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-eyebrow mb-3">同款广场</p>
              <h2 className="text-heading-2 text-ink">看看大家的同款</h2>
            </div>
            <Link href="/plaza" className="text-sm text-steel hover:text-ink font-medium hidden md:block">
              进入同款广场 →
            </Link>
          </div>

          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {posts.map((post) => (
              <div key={post.post_id} className="break-inside-avoid">
                <div className="rounded-3xl overflow-hidden border border-hairline-soft hover:shadow-card transition-shadow">
                  <div
                    className="w-full aspect-[3/4] flex flex-col items-center justify-center relative"
                    style={{ backgroundColor: post.bg_color }}
                  >
                    <span className="text-4xl opacity-30">★</span>
                    <div className="absolute bottom-3 left-3">
                      <GroupBadge groupId={post.group_id} size="sm" />
                    </div>
                    <div className="absolute top-2 right-2 text-xs font-mono text-white/60 bg-black/20 px-2 py-0.5 rounded-full">
                      AI Generated
                    </div>
                  </div>
                  <div className="bg-canvas p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-surface flex items-center justify-center text-xs font-bold text-steel">
                        {post.avatar_initial[0]}
                      </div>
                      <span className="text-xs font-medium text-ink">{post.username}</span>
                    </div>
                    <p className="text-xs text-slate line-clamp-2">{post.caption}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-stone">
                      <span>❤️ {formatCount(post.likes)}</span>
                      <span>⭐ {formatCount(post.saves)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link href="/plaza" className="text-sm text-steel hover:text-ink font-medium">
              进入同款广场 →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────── */}
      <section className="py-20">
        <div className="section-container">
          <div className="bg-ink rounded-feature p-12 md:p-16 text-center">
            <p className="text-eyebrow text-white/50 mb-4">准备好了吗</p>
            <h2 className="text-heading-1 text-white mb-4">
              准备好和爱豆同款了吗？
            </h2>
            <p className="text-base text-white/60 mb-10 max-w-md mx-auto">
              加入数千名粉丝，发现首尔爱豆同款圣地，生成你的专属同款打卡照
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/map" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-ink text-sm font-medium hover:bg-surface transition-colors">
                🗺️ 开始探索地图
              </Link>
              <Link href="/generate" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/20 text-white text-sm font-medium hover:border-white/50 transition-colors">
                ✨ 生成同款照
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
