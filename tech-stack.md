# K-Star Spot · 技术栈选型 v1.0

> 基于 design-document.md，面向「明天可演示的成品 Web」选型
> 原则：最少依赖、最快上手、最好看、零运维

---

## 总览

```
用户浏览器
    ↓
Next.js 14 (Vercel 托管)
  ├── 前端页面 (React + Tailwind + shadcn/ui)
  ├── API Routes (Serverless，代理所有外部 API)
  └── 静态 JSON (Seed 数据，不依赖数据库)
         ↓
  ┌──────┼──────────────┐
  │      │              │
Mapbox  Anthropic    Replicate
(地图)  (LLM 抽取)   (图像生成)
```

---

## 各层选型

### 1. 框架：Next.js 14 (App Router)

- API Routes 内置，前后端一个仓库，不用单独起后端
- 天然支持 SSR，地图页首屏有内容（不是白屏）
- Vercel 一键部署，push 即上线
- `next/image` 自动优化图片，社群广场图加载快

```
src/
├── app/
│   ├── page.tsx              # 首页 P-01
│   ├── map/page.tsx          # 地图页 P-02
│   ├── template/[id]/page.tsx # 模板详情 P-03
│   ├── generate/page.tsx     # 云同款生成 P-04
│   ├── route/page.tsx        # 路线规划 P-05
│   ├── plaza/page.tsx        # 同款广场 P-06
│   ├── behind-ai/page.tsx    # Behind the AI P-07
│   └── api/
│       ├── templates/route.ts
│       ├── generate/route.ts
│       ├── routes/route.ts
│       └── agent/route.ts
├── components/
├── data/                     # 静态 JSON Seed 数据
└── lib/
```

---

### 2. 样式：Tailwind CSS + shadcn/ui

- shadcn/ui 组件可以直接复制进项目，不引入运行时包体积
- Tailwind 写响应式极快（`md:` `lg:` 前缀），手机/桌面一套代码
- 视觉风格接近 PRD 要求（浅色、圆角、留白）

| 组件需求 | shadcn/ui 组件 |
|---------|---------------|
| 筛选 chips | Badge + 自定义 toggle 样式 |
| 半屏地点卡片 | Sheet (bottom drawer) |
| 分步生成流程 | 自定义 Stepper + Card |
| 社群 feed | 自定义瀑布流 (CSS columns) |
| 路线时间线 | 自定义 Timeline |
| Loading 动效 | Skeleton + 自定义 spinner |

---

### 3. 地图：Mapbox GL JS + react-map-gl

- 视觉效果最接近 PRD 参考图（PamPam 风格）
- `react-map-gl` 封装好，React 里直接用
- 自定义 pin（爱豆头像圆形）支持最完整
- 免费额度：每月 5 万次 map load，演示完全够用
- **需要的 Key**：Mapbox Public Token（前端直接用，安全）

---

### 4. 数据：静态 JSON（作品集阶段，不用数据库）

- 明天演示，静态 JSON 零配置、零网络依赖风险
- 社群互动（点赞/收藏）用 `localStorage` 模拟，演示效果一致
- Seed 数据 15-20 条，JSON 文件完全够

```
data/
├── templates.json    # 15-20 个同款地点模板
├── groups.json       # BTS / BLACKPINK / aespa
├── idols.json        # 各团成员
└── posts.json        # 种子社群帖子（预生成图 + 文案）
```

**Supabase 什么时候加**：演示通过后，正式 MVP 阶段迁移，改动只在 `lib/data.ts`。

---

### 5. AI 能力

#### LLM（Agent Demo）：Anthropic claude-sonnet-4-6

**没有 Key 的兜底方案**：Behind the AI 页展示预跑好的输入/输出对，静态展示，演示效果相同。

#### 图像生成：Replicate API

**没有 Key 的兜底方案**：预生成 2-3 张「同款效果图」放 `public/mock-outputs/`，交互流程完整。

---

### 6. 部署：Vercel

`git push` 自动触发部署，URL 立刻可分享。免费套餐够演示。

---

## 不用的技术（及原因）

| 排除项 | 原因 |
|--------|------|
| Supabase（作品集阶段） | 增加配置成本，静态 JSON 足够 |
| Redux / Zustand | 状态简单，React Context + useState 够用 |
| React Query / SWR | 静态数据不需要缓存管理 |
| Docker | Vercel Serverless 不需要容器 |
| Prisma / Drizzle ORM | 无数据库，不需要 ORM |
| Figma 原型（独立） | Web 做移动端响应式，直接充当 App Demo |

---

## 环境变量清单

```bash
# .env.local
NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxx    # 前端直接用，NEXT_PUBLIC 前缀
ANTHROPIC_API_KEY=sk-ant-xxx       # 仅服务端 API Routes 调用
REPLICATE_API_TOKEN=r8_xxx         # 仅服务端 API Routes 调用
```

- `NEXT_PUBLIC_` 前缀变量暴露到前端，Mapbox Public Token 本来就是公开的，安全
- Anthropic / Replicate Key 不加前缀，只在服务端用，不泄漏

---

## 依赖清单

```json
{
  "dependencies": {
    "next": "^14",
    "react": "^18",
    "react-dom": "^18",
    "react-map-gl": "^7",
    "mapbox-gl": "^3",
    "@anthropic-ai/sdk": "^0.24",
    "replicate": "^0.31",
    "tailwindcss": "^3",
    "clsx": "^2",
    "lucide-react": "^0.400"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/react": "^18",
    "@types/node": "^20"
  }
}
```

> shadcn/ui 组件按需 `npx shadcn-ui@latest add`，不全量引入。

---

## 总结

| 关注点 | 方案 | 理由 |
|--------|------|------|
| 开发速度 | Next.js + Tailwind + shadcn/ui | 最成熟的快速开发组合 |
| 视觉质量 | Mapbox + 自定义 pin + Tailwind | 开箱高颜值 |
| 数据复杂度 | 静态 JSON | 零风险，够演示 |
| AI 演示 | Anthropic（有 Key）/ 预跑样例（无 Key）| 都能演示完整链路 |
| 生图演示 | Replicate（有 Key）/ mock 图（无 Key）| 流程完整不依赖 Key |
| 部署 | Vercel | push 即上线，URL 可分享 |
| App Demo | Web 移动端响应式充当 | 省去 Figma，更真实 |

*tech-stack.md v1.0 · K-Star Spot*
