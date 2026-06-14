import Link from "next/link";

const EXAMPLE_INPUT = `粉丝攻略：BTS RM 在 2023 年 10 月发了一组 ins 照片，拍摄地点是首尔圣水洞的蓝瓶咖啡。
照片里 RM 站在靠近落地玻璃窗的大理石吧台旁边，侧身 45 度，手里拿着咖啡杯。
自然光从右后方打入，整体色调温暖偏韩系清透风。
营业时间早上 8 点到晚上 9 点，周末人多需要排队，建议平时早上 9-10 点去。`;

const EXAMPLE_OUTPUT = `{
  "template_id": "tpl-001",
  "group_name": "BTS",
  "idol_name": "RM",
  "city": "首尔",
  "district": "성수동",
  "place_name_cn": "蓝瓶咖啡 圣水店",
  "place_name_kr": "블루보틀커피 성수점",
  "lat": 37.5442,
  "lng": 127.0568,
  "place_type": "cafe_restaurant",
  "spot_reason": "RM 2023年10月 ins 同款拍摄地点",
  "photo_tips": "靠近落地玻璃窗吧台，侧身45度，自然光从右后方打入",
  "risk_notes": "周末排队较长，建议平时早上9-10点前往",
  "composition_tags": ["side_profile", "window_light", "half_body"],
  "style_tags": ["korean_clean", "warm_light", "cafe_aesthetic"],
  "pose_tags": ["standing", "holding_drink"],
  "cloud_generation_prompt": "A young person standing near floor-to-ceiling windows in a minimalist industrial coffee shop, holding a coffee cup, natural side lighting, marble counter visible...",
  "priority_scores": {
    "idol_relevance_score": 0.95,
    "overall_priority": 0.87
  }
}`;

const STEPS = [
  {
    num: "01",
    title: "原始文案输入",
    desc: "接收粉丝攻略、官方推文、媒体报道等非结构化文本",
    bg: "bg-block-lilac",
  },
  {
    num: "02",
    title: "LLM 语义解析",
    desc: "claude-sonnet-4-6 通过 Tool Use 强制输出，解析地点、爱豆、拍照建议等信息",
    bg: "bg-block-teal",
  },
  {
    num: "03",
    title: "结构化模板生成",
    desc: "输出标准 IdolSpotTemplate 格式，包含 3 维标签和优先级评分",
    bg: "bg-block-yellow",
  },
  {
    num: "04",
    title: "人工审核上线",
    desc: "运营团队验证信息真实性后，模板进入地图和生成系统",
    bg: "bg-block-coral",
  },
];

export default function BehindAIPage() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Hero */}
      <div className="bg-block-navy">
        <div className="section-container py-20">
          <p className="text-eyebrow text-white/40 mb-4">BEHIND THE AI</p>
          <h1 className="text-heading-1 text-white mb-4">Spot Template Agent</h1>
          <p className="text-base text-white/60 max-w-2xl">
            K-Star Spot 的内容由 AI Agent 自动提取生成。我们将粉丝攻略、官方社媒、媒体报道
            转化为结构化的「同款模板」，驱动地图、路线规划和云同款生成三大功能。
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="section-container py-16">
        <p className="text-eyebrow mb-3">工作流程</p>
        <h2 className="text-heading-2 text-ink mb-10">Agent 如何工作？</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map((s) => (
            <div key={s.num} className={`${s.bg} rounded-3xl p-7`}>
              <p className="text-stat text-ink mb-3 opacity-20">{s.num}</p>
              <h3 className="text-heading-3 text-ink mb-3">{s.title}</h3>
              <p className="text-sm text-slate">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Live example */}
      <div className="bg-surface py-16">
        <div className="section-container">
          <p className="text-eyebrow mb-3">实际案例</p>
          <h2 className="text-heading-2 text-ink mb-8">输入 → 输出 全流程演示</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-block-coral text-[#600000]">
                  输入 · 原始粉丝攻略
                </span>
              </div>
              <pre className="bg-canvas rounded-2xl border border-hairline p-6 text-sm text-slate font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {EXAMPLE_INPUT}
              </pre>
            </div>

            {/* Output */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-block-teal text-[#007A92]">
                  输出 · 结构化模板 JSON
                </span>
                <span className="text-xs text-stone">claude-sonnet-4-6 · Tool Use</span>
              </div>
              <pre className="bg-[#1a1a3e] rounded-2xl p-6 text-sm text-[#c3faf5] font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap text-xs">
                {EXAMPLE_OUTPUT}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Technical details */}
      <div className="section-container py-16">
        <p className="text-eyebrow mb-3">技术细节</p>
        <h2 className="text-heading-2 text-ink mb-8">核心技术实现</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {[
            {
              title: "LLM：claude-sonnet-4-6",
              desc: "使用 Tool Use + tool_choice 强制 JSON 输出，确保结构化数据稳定，不产生幻觉",
              bg: "bg-block-lilac",
            },
            {
              title: "三维标签体系",
              desc: "构图标签（构图角度/位置）× 色调标签（光线/风格）× 姿势标签（站/坐/持物）",
              bg: "bg-block-teal",
            },
            {
              title: "优先级评分",
              desc: "6 维打分：爱豆相关度、热度、稀缺性、出片质量、新鲜度、可信度，加权综合排序",
              bg: "bg-block-yellow",
            },
          ].map((c) => (
            <div key={c.title} className={`${c.bg} rounded-3xl p-7`}>
              <h3 className="text-heading-3 text-ink mb-3">{c.title}</h3>
              <p className="text-sm text-slate leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>

        {/* Code snippet */}
        <div className="bg-surface rounded-2xl border border-hairline p-6">
          <p className="text-eyebrow mb-3">API 调用示例</p>
          <pre className="text-sm font-mono text-slate overflow-x-auto whitespace-pre-wrap">{`// app/api/agent/route.ts
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const response = await client.messages.create({
  model: 'claude-sonnet-4-6',
  tools: [{ name: 'create_spot_template', input_schema: SCHEMA }],
  tool_choice: { type: 'tool', name: 'create_spot_template' },
  messages: [{ role: 'user', content: rawFanArticleText }]
});

// Tool Use 强制输出，结构化数据零幻觉
const template = response.content[0].input;`}</pre>
        </div>
      </div>

      {/* Compliance */}
      <div className="section-container pb-16">
        <div className="bg-block-yellow rounded-3xl p-10">
          <p className="text-eyebrow mb-3">合规边界</p>
          <h2 className="text-heading-2 text-ink mb-6">我们不做什么</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "❌ 不生成爱豆本人形象",
              "❌ 不生成用户与爱豆的合照",
              "❌ 不伪造爱豆出现在新场景",
              "❌ 不存储 / 复用 / 二次分发爱豆原图",
              "✅ 仅提取场景/构图/色调等抽象描述",
              "✅ 生成对象始终是用户本人",
              "✅ 所有结果标注「AI Generated · K-Star Spot」",
              "✅ 屏蔽明星脸 / 未成年人 / NSFW 内容",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm text-slate">
                <span className="mt-0.5">{item.slice(0, 2)}</span>
                <span>{item.slice(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="section-container pb-20">
        <div className="text-center">
          <h2 className="text-heading-2 text-ink mb-4">想要亲自体验？</h2>
          <p className="text-base text-steel mb-8">选择一个爱豆同款模板，生成你的专属打卡照</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/map" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-ink text-white text-sm font-medium hover:bg-charcoal transition-colors">
              🗺️ 探索圣地地图
            </Link>
            <Link href="/generate" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-hairline-strong text-ink text-sm font-medium hover:bg-surface transition-colors">
              ✨ 生成同款照
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
