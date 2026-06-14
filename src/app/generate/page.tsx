"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getTemplates, getTemplateById, Template } from "@/lib/data";
import { GROUP_CONFIG, PLACE_TYPE_LABELS } from "@/lib/utils";
import GroupBadge from "@/components/GroupBadge";

type GroupId = keyof typeof GROUP_CONFIG;

const COMPOSITION_OPTIONS = ["half_body", "full_body", "close_up", "side_profile", "back_view", "front_facing"];
const STYLE_OPTIONS = ["korean_clean", "warm_light", "cool_tone", "golden_hour", "street_snap", "cafe_aesthetic", "minimal", "film_grain"];
const POSE_OPTIONS = ["standing", "sitting", "walking", "holding_drink", "looking_back", "leaning_on_wall", "hands_in_pocket"];

const TAG_LABELS: Record<string, string> = {
  half_body: "半身照", full_body: "全身照", close_up: "特写", side_profile: "侧脸", back_view: "背影", front_facing: "正面",
  korean_clean: "韩系清透", warm_light: "暖光", cool_tone: "冷调", golden_hour: "黄金时刻", street_snap: "街拍风", cafe_aesthetic: "咖啡馆", minimal: "极简", film_grain: "胶片感",
  standing: "站姿", sitting: "坐姿", walking: "行走", holding_drink: "拿饮品", looking_back: "回眸", leaning_on_wall: "靠墙", hands_in_pocket: "手插口袋",
};

const GROUP_GRADIENTS: Record<string, string> = {
  bts: "from-[#ede8f8] to-[#d8ccf0]",
  blackpink: "from-[#fde0f0] to-[#f5b8d8]",
  aespa: "from-[#c3faf5] to-[#9aeee8]",
};

const STEPS = ["选择模板", "调整参数", "上传照片", "生成结果"];

function GenerateContent() {
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get("template");

  const allTemplates = getTemplates();
  const [step, setStep] = useState(preselectedId ? 1 : 0);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    preselectedId ? (getTemplateById(preselectedId) ?? null) : null
  );
  const [filterGroup, setFilterGroup] = useState("all");
  const [compTags, setCompTags] = useState<string[]>([]);
  const [styleTags, setStyleTags] = useState<string[]>([]);
  const [poseTags, setPoseTags] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{ images: string[]; caption: string; disclaimer: string; mock?: boolean } | null>(null);

  const filteredTemplates = filterGroup === "all" ? allTemplates : allTemplates.filter((t) => t.group_id === filterGroup);

  function toggleTag(arr: string[], setArr: (v: string[]) => void, tag: string) {
    setArr(arr.includes(tag) ? arr.filter((t) => t !== tag) : [...arr, tag]);
  }

  async function handleGenerate() {
    if (!selectedTemplate) return;
    setIsGenerating(true);
    setStep(3);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template_id: selectedTemplate.template_id,
          composition_tags: compTags,
          style_tags: styleTags,
          pose_tags: poseTags,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        images: ["/mock-outputs/generated-1.jpg"],
        caption: `在 ${selectedTemplate.group_name} 同款地点，感觉自己也是首尔 girl ✨`,
        disclaimer: "AI Generated · K-Star Spot",
        mock: true,
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-canvas">
      <div className="border-b border-hairline-soft">
        <div className="section-container py-6">
          <h1 className="text-heading-2 text-ink mb-1">生成我的同款照</h1>
          <p className="text-sm text-steel">上传照片，AI 帮你生成爱豆同款打卡照</p>
        </div>
      </div>

      <div className="border-b border-hairline-soft bg-surface">
        <div className="section-container py-4">
          <div className="flex items-center gap-0 overflow-x-auto">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  i === step ? "bg-ink text-white" : i < step ? "text-ink" : "text-stone"
                }`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    i < step ? "bg-success text-white" : i === step ? "bg-white/20" : "bg-hairline"
                  }`}>
                    {i < step ? "✓" : i + 1}
                  </span>
                  <span className="hidden sm:block">{s}</span>
                </div>
                {i < STEPS.length - 1 && <div className="w-8 h-px bg-hairline mx-1" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-container py-10 max-w-3xl mx-auto">
        {step === 0 && (
          <div>
            <h2 className="text-heading-3 text-ink mb-6">选择同款模板</h2>
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
              {["all", "bts", "blackpink", "aespa"].map((g) => (
                <button
                  key={g}
                  onClick={() => setFilterGroup(g)}
                  className={`pill-tab flex-shrink-0 ${filterGroup === g ? "active" : ""}`}
                >
                  {g === "all" ? "全部" : g === "bts" ? "BTS" : g === "blackpink" ? "BLACKPINK" : "aespa"}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredTemplates.map((t) => {
                const gradient = GROUP_GRADIENTS[t.group_id] ?? "from-[#f0f0f0] to-[#e0e0e0]";
                const config = GROUP_CONFIG[t.group_id as GroupId];
                return (
                  <button
                    key={t.template_id}
                    onClick={() => { setSelectedTemplate(t); setStep(1); }}
                    className="text-left rounded-2xl border border-hairline-soft overflow-hidden hover:border-ink hover:shadow-card transition-all"
                  >
                    <div className={`h-28 bg-gradient-to-br ${gradient} relative flex items-end p-3`}>
                      <GroupBadge groupId={t.group_id} idolName={t.idol_name ?? undefined} size="sm" />
                      <div className="absolute top-3 right-3 w-12 h-12 rounded-full opacity-25" style={{ backgroundColor: config?.color }} />
                    </div>
                    <div className="p-4">
                      <p className="font-semibold text-ink text-sm mb-0.5">{t.place_name_cn}</p>
                      <p className="text-xs text-steel">{t.district} · {PLACE_TYPE_LABELS[t.place_type]}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 1 && selectedTemplate && (
          <div>
            <div className="flex items-center gap-3 mb-8 p-5 bg-surface rounded-2xl">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${GROUP_GRADIENTS[selectedTemplate.group_id]} flex-shrink-0`} />
              <div>
                <GroupBadge groupId={selectedTemplate.group_id} idolName={selectedTemplate.idol_name ?? undefined} size="sm" />
                <p className="font-semibold text-ink mt-1">{selectedTemplate.place_name_cn}</p>
                <p className="text-xs text-steel">{selectedTemplate.district}</p>
              </div>
              <button onClick={() => setStep(0)} className="ml-auto text-xs text-steel hover:text-ink">换一个 →</button>
            </div>

            <h2 className="text-heading-3 text-ink mb-6">调整同款参数</h2>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-ink mb-3">构图</p>
                <div className="flex flex-wrap gap-2">
                  {COMPOSITION_OPTIONS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(compTags, setCompTags, tag)}
                      className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                        compTags.includes(tag) ? "bg-block-lilac border-[#9B59B6] text-[#6B3FA0]" : "border-hairline text-steel hover:border-hairline-strong"
                      }`}
                    >
                      {TAG_LABELS[tag] ?? tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-ink mb-3">色调风格</p>
                <div className="flex flex-wrap gap-2">
                  {STYLE_OPTIONS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(styleTags, setStyleTags, tag)}
                      className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                        styleTags.includes(tag) ? "bg-block-teal border-[#00B4D8] text-[#007A92]" : "border-hairline text-steel hover:border-hairline-strong"
                      }`}
                    >
                      {TAG_LABELS[tag] ?? tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-ink mb-3">姿势</p>
                <div className="flex flex-wrap gap-2">
                  {POSE_OPTIONS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(poseTags, setPoseTags, tag)}
                      className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                        poseTags.includes(tag) ? "bg-block-rose border-[#E91E8C] text-[#B01569]" : "border-hairline text-steel hover:border-hairline-strong"
                      }`}
                    >
                      {TAG_LABELS[tag] ?? tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => setStep(2)}
                className="w-full py-4 rounded-full bg-ink text-white font-medium hover:bg-charcoal transition-colors"
              >
                下一步 →
              </button>
            </div>
          </div>
        )}

        {step === 2 && selectedTemplate && (
          <div>
            <h2 className="text-heading-3 text-ink mb-2">上传你的照片</h2>
            <p className="text-sm text-steel mb-8">建议：正面照，光线充足，单人为主</p>

            <div className="border-2 border-dashed border-hairline-strong rounded-3xl p-12 text-center mb-6 hover:border-ink transition-colors cursor-pointer">
              <div className="text-4xl mb-3">📷</div>
              <p className="font-medium text-ink mb-1">点击或拖拽上传照片</p>
              <p className="text-sm text-steel">支持 JPG / PNG · 建议 ≤10MB</p>
              <input type="file" accept="image/*" className="hidden" />
            </div>

            <div className="bg-block-mint rounded-2xl p-5 space-y-2 mb-8">
              {[
                "你的照片仅用于本次生成，不会被存储或分发",
                "生成结果不含爱豆本人形象，仅参考同款场景风格",
                "所有输出结果标注「AI Generated · K-Star Spot」",
              ].map((text) => (
                <div key={text} className="flex items-start gap-2 text-sm text-slate">
                  <span className="text-success mt-0.5">✅</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              className="w-full py-4 rounded-full bg-ink text-white font-medium hover:bg-charcoal transition-colors"
            >
              ✨ 开始生成同款照
            </button>
            <p className="text-center text-xs text-stone mt-3">
              演示模式下将展示预设效果图 · 预计 15–30 秒
            </p>
          </div>
        )}

        {step === 3 && (
          <div>
            {isGenerating ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 border-4 border-hairline border-t-ink rounded-full animate-spin mx-auto mb-6" />
                <h2 className="text-heading-3 text-ink mb-4">AI 正在生成同款照...</h2>
                <div className="space-y-2 text-sm text-steel max-w-xs mx-auto">
                  <p>✅ 正在理解同款场景...</p>
                  <p>⏳ 正在调整构图色调...</p>
                  <p className="text-muted">○ 正在生成你的同款照...</p>
                </div>
                <p className="text-xs text-stone mt-6">预计 15–30 秒</p>
              </div>
            ) : result ? (
              <div>
                <h2 className="text-heading-3 text-ink mb-6">🎉 你的同款照出炉了！</h2>
                {result.mock && (
                  <div className="bg-block-yellow rounded-xl p-3 mb-5 text-sm text-[#746019] flex items-center gap-2">
                    <span>📌</span>
                    <span>演示模式 · 配置 REPLICATE_API_TOKEN 后可生成真实图像</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`aspect-[3/4] rounded-2xl flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br ${
                        selectedTemplate ? GROUP_GRADIENTS[selectedTemplate.group_id] : "from-[#f0f0f0] to-[#e0e0e0]"
                      }`}
                    >
                      <span className="text-6xl opacity-15">★</span>
                      <div className="absolute bottom-2 right-2 text-xs font-mono text-white/70 bg-black/30 px-2 py-0.5 rounded-full text-[10px]">
                        AI Generated
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-stone text-center mb-6">
                  📝 {result.disclaimer} · K-Star Spot
                </p>

                <div className="bg-surface rounded-2xl p-5 mb-6">
                  <p className="text-xs font-mono uppercase tracking-wider text-stone mb-2">生成文案（可编辑）</p>
                  <p className="text-sm text-slate">{result.caption}</p>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/plaza"
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-ink text-white font-medium hover:bg-charcoal transition-colors"
                  >
                    晒到同款广场 →
                  </Link>
                  <button
                    onClick={() => { setStep(0); setSelectedTemplate(null); setResult(null); }}
                    className="w-full py-3.5 rounded-full border border-hairline-strong text-ink font-medium hover:bg-surface transition-colors"
                  >
                    换个模板重新生成
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-steel">加载中...</div>}>
      <GenerateContent />
    </Suspense>
  );
}
