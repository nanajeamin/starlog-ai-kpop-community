# K-Star Spot · 网页实施计划 v1.0

> 基于：design-document.md + tech-stack.md + Miro Design System
> 执行日期：2026-06-14
> 目标：明天可演示的成品网页

---

## 一、设计语言适配（Miro → K-Star Spot）

### 核心映射

| Miro 设计元素 | K-Star Spot 适配 |
|---|---|
| 白色画布 + 黑色主 CTA | 白色画布 + 黑色主 CTA（同款） |
| Canary Yellow 品牌标识 | 无特定品牌色，Logo 用黑色字 |
| 粉彩 Feature Cards (rose/teal/coral/yellow) | 三团粉彩色块：BTS lilac / BLACKPINK rose / aespa teal + coral 通用 |
| Pill buttons (`border-radius: 9999px`) | 所有按钮胶囊形（同款） |
| Roobert PRO 字体 | **Inter**（Google Fonts，替代品） |
| 80px 英雄标题 / -2px 字距 | 中文英雄标题 64px / -1.5px 字距（中文负字距更保守） |
| 深色 Footer (#1c1c1e) | 同款深色 Footer |
| rounded-xxxl (28px) 粉彩卡片 | 同款 |
| Promo Banner（顶部黑条） | 顶部黑条：「K-Star Spot Beta · 明星同款云巡礼」 |

### 色彩体系

```css
/* 主色 */
--ink: #1c1c1e;
--canvas: #ffffff;
--surface: #f7f8fa;
--hairline: #e0e2e8;
--hairline-strong: #c7cad5;
--steel: #6b6f7e;

/* 粉彩 Feature Cards（K-pop 团体映射）*/
--block-lilac: #ede8f8;    /* BTS */
--block-rose: #fde0f0;     /* BLACKPINK */
--block-teal: #c3faf5;     /* aespa */
--block-coral: #ffc6c6;    /* 通用暖色 */
--block-yellow: #fff4c4;   /* 通用亮色 */
--block-navy: #1a1a3e;     /* 深色英雄区 */

/* 语义色 */
--success: #00b473;
--brand-blue: #4262ff;     /* 链接色 */
```

### 字体层级

| Token | 大小 | 权重 | 行高 | 字距 | 用途 |
|---|---|---|---|---|---|
| display | 64px → 40px(mobile) | 600 | 1.05 | -1.5px | 首页英雄标题 |
| heading-1 | 48px → 32px(mobile) | 600 | 1.15 | -1px | 页面级标题 |
| heading-2 | 36px → 26px(mobile) | 600 | 1.20 | -0.5px | 区块标题 |
| heading-3 | 24px | 600 | 1.25 | 0 | 卡片标题 |
| body-lg | 18px | 400 | 1.50 | 0 | 英雄副标题 |
| body | 16px | 400 | 1.50 | 0 | 正文 |
| body-sm | 14px | 400 | 1.50 | 0 | 元数据 |
| caption | 12px | 500 | 1.40 | 0.3px | 标签/眉标（大写） |

---

## 二、页面清单与优先级

| # | 路由 | 页面名 | 优先级 | 估时 |
|---|---|---|---|---|
| 1 | `/` | 首页 | P0 | 2h |
| 2 | `/map` | 圣地巡礼地图页 | P0 | 2h |
| 3 | `/template/[id]` | 模板详情页 | P0 | 1.5h |
| 4 | `/generate` | 云同款生成页 | P0 | 2h |
| 5 | `/route` | 路线规划页 | P0 | 1.5h |
| 6 | `/plaza` | 同款广场页 | P0 | 1.5h |
| 7 | `/behind-ai` | Behind the AI | P0 | 1h |

---

## 三、组件架构

```
src/
├── app/
│   ├── layout.tsx              # Root layout + Nav + Footer
│   ├── page.tsx                # 首页
│   ├── map/page.tsx            # 地图页
│   ├── template/[id]/page.tsx  # 模板详情
│   ├── generate/page.tsx       # 云同款生成（client component）
│   ├── route/page.tsx          # 路线规划
│   ├── plaza/page.tsx          # 同款广场
│   ├── behind-ai/page.tsx      # Behind the AI
│   └── api/
│       ├── templates/route.ts
│       ├── generate/route.ts
│       └── routes/route.ts
├── components/
│   ├── Nav.tsx                 # 顶部导航 + 移动端汉堡菜单
│   ├── Footer.tsx              # 深色底部
│   ├── PromoBanner.tsx         # 顶部黑条
│   ├── TemplateCard.tsx        # 同款模板卡片（地图/广场通用）
│   ├── GroupBadge.tsx          # BTS/BLACKPINK/aespa 彩色徽章
│   ├── PillButton.tsx          # 胶囊按钮（primary/secondary/ghost）
│   ├── MapPlaceholder.tsx      # 无 Token 时的地图替代
├── data/
│   ├── templates.json          # 15 个模板
│   ├── groups.json             # 3 个团体
│   └── posts.json              # 12 个社群帖子
└── lib/
    ├── data.ts                 # 数据读取函数
    └── utils.ts                # cn(), formatCount()
```

---

## 四、执行步骤（按顺序）

### Step 1：基础设施
1. `tailwind.config.ts` — 添加自定义色彩 token、字体
2. `src/app/globals.css` — CSS 变量、字体引入、基础 reset
3. `src/lib/utils.ts` — cn(), formatCount()
4. `src/lib/data.ts` — getTemplates(), getTemplateById(), getGroups()
5. `src/data/posts.json` — 12 条 mock 社群帖子

### Step 2：共享组件
6. `src/components/PillButton.tsx`
7. `src/components/GroupBadge.tsx`
8. `src/components/TemplateCard.tsx`
9. `src/components/PromoBanner.tsx`
10. `src/components/Nav.tsx`
11. `src/components/Footer.tsx`
12. `src/components/MapPlaceholder.tsx`

### Step 3：API Routes
13. `src/app/api/templates/route.ts`
14. `src/app/api/generate/route.ts`
15. `src/app/api/routes/route.ts`

### Step 4：页面
16. `src/app/layout.tsx`
17. `src/app/page.tsx`
18. `src/app/map/page.tsx`
19. `src/app/template/[id]/page.tsx`
20. `src/app/generate/page.tsx`
21. `src/app/route/page.tsx`
22. `src/app/plaza/page.tsx`
23. `src/app/behind-ai/page.tsx`

### Step 5：验证
24. `npm run build` — 修复所有 TypeScript/构建错误
25. 推送到 `claude/determined-fermi-l594c4` 分支 ✅

---

## 五、关键约束清单

| 约束 | 实现方式 |
|---|---|
| 无 Mapbox Token | MapPlaceholder 组件：美观占位 + 黄色 banner 提示 |
| 无 Replicate Token | API 返回 mock 图路径，前端展示预设图 |
| 无 Anthropic Key | Behind the AI 页展示静态预跑案例 |
| 合规：不生成爱豆形象 | 生成页合规声明 + prompt 中无爱豆姓名 |
| 移动端响应式 | Tailwind `md:` / `lg:` 前缀全覆盖 |
