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
│   ├── PillTab.tsx             # 胶囊 Tab 筛选
│   ├── FeatureCard.tsx         # 粉彩 Feature Card
│   ├── StatDisplay.tsx         # 数据展示（64px 数字）
│   └── MapPlaceholder.tsx      # 无 Token 时的地图替代
├── data/
│   ├── templates.json          # 15 个模板（已完成）
│   ├── groups.json             # 3 个团体（已完成）
│   └── posts.json              # 12 个社群帖子（待创建）
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
7. `src/components/PillTab.tsx`
8. `src/components/GroupBadge.tsx`
9. `src/components/FeatureCard.tsx`
10. `src/components/TemplateCard.tsx`
11. `src/components/PromoBanner.tsx`
12. `src/components/Nav.tsx` （含移动端 drawer）
13. `src/components/Footer.tsx`
14. `src/components/MapPlaceholder.tsx`

### Step 3：API Routes
15. `src/app/api/templates/route.ts`
16. `src/app/api/generate/route.ts`
17. `src/app/api/routes/route.ts`

### Step 4：页面（按优先级）
18. `src/app/layout.tsx` — 接入 PromoBanner + Nav + Footer
19. `src/app/page.tsx` — 首页
20. `src/app/map/page.tsx` — 地图页
21. `src/app/template/[id]/page.tsx` — 模板详情
22. `src/app/generate/page.tsx` — 云同款生成（4-step wizard）
23. `src/app/route/page.tsx` — 路线规划
24. `src/app/plaza/page.tsx` — 同款广场
25. `src/app/behind-ai/page.tsx` — Behind the AI

### Step 5：验证
26. `npm run build` — 修复所有 TypeScript/构建错误
27. 推送到 `claude/determined-fermi-l594c4` 分支

---

## 五、各页面详细设计规格

### P-01 首页

**视觉结构（Miro 风格适配）**：
```
[黑色 Promo Banner] "K-Star Spot Beta · 爱豆同款云巡礼 ✨"

[Nav] Logo "K·Star·Spot" | 地图 | 生成 | 广场 | 路线 | AI揭秘 | [开始探索 ▶]

─────── 白色英雄区 ──────────
  [眉标] KSTAR SPOT · AI POWERED
  
  和爱豆同款
  从打卡到云巡礼                    ← 64px / 600 / -1.5px
  
  发现 15+ 首尔爱豆圣地，生成属于你的     ← 18px 副标题
  同款打卡照，和同好一起追星              

  [探索首尔地图 →]  [生成我的同款照]    ← 黑色胶囊 + 描边胶囊

─────── 粉彩 Feature Block（lilac/BTS 色调）──────
  眉标：精选同款地点
  「同款模板热度榜」
  [横向滚动卡片 × 4]
  每张：地点名 + 爱豆名 + 人数 + 粉彩背景

─────── 白色区：三大功能 ──────
  [3列粉彩卡片]
  🗺️ 圣地地图          ✨ 云同款生成         🛣️ 路线规划
  (block-teal)          (block-rose)           (block-yellow)
  发现首尔爱豆          上传照片 AI 生成       一键规划首尔
  同款打卡地            你的同款打卡照         爱豆巡礼路线

─────── 深色 Stats Block ──────
  3个顶流团体    15个圣地模板    5000+粉丝生成    ← 64px stat-display

─────── 同款广场预览（白色区）──────
  眉标：同款广场
  「看看大家的同款」
  [2列网格 × 3 post 卡片]
  [进入同款广场 →]

─────── 深色 CTA Banner ──────
  「准备好和爱豆同款了吗？」
  [开始探索]  [生成同款]

[Footer]
```

### P-02 地图页

**布局（左右分栏，移动端上下）**：
```
筛选栏（胶囊 pills）：[全部] [BTS] [BLACKPINK] [aespa] | [全部] [咖啡厅] [快闪] [公司] ...

左栏（33%）：模板列表卡片（可滚动）
右栏（67%）：地图区域
  - 有 Mapbox Token：react-map-gl 地图 + 爱豆 pin
  - 无 Token：美观的首尔地图 SVG 占位 + 地点标注网格

点击卡片：侧边详情弹出 or 跳转 /template/[id]
```

### P-03 模板详情页

**关键 Section**：
1. 顶部图片区（粉彩渐变占位 + 团体/爱豆标签浮层）
2. 基本信息 Grid（区域、类型、地址）
3. 「为什么值得打卡」（block-yellow 色块）
4. 三维标签（构图/色调/姿势 chips）
5. 拍照建议（block-teal 色块）
6. ⚠️ 风险提示
7. 社群同款墙（3列图片网格，mock）
8. 底部双 CTA（fixed bar）：加入路线 + 生成同款

### P-04 云同款生成页

**4步 Stepper（client component）**：
- Step 1：选模板（支持按团体筛选）
- Step 2：调整同款参数（标签多选，胶囊形）
- Step 3：上传照片（合规声明）
- Step 4：生成结果（mock 图 or Replicate API）

顶部进度条：○─●─○─○ 胶囊形步骤指示器

### P-05 路线规划页

**已选地点 + 推荐路线**：
- 顶部：按团体选择预设路线（胶囊 tabs）
- 路线卡片：带编号的时间线，步行距离
- 地图展示（同地图页逻辑）

### P-06 同款广场

**瀑布流布局**：
- 团体 tabs + 类型 tabs
- 2列 CSS columns 瀑布流
- 每卡：粉彩背景图占位 + 用户名 + 标签 + like/save
- localStorage 记录 like/save 状态

### P-07 Behind the AI

**内容结构**：
- 英雄区：标题 + 副标题
- Agent 工作流图示（步骤卡片）
- 实例演示：原始文本 → JSON 输出（code block）
- 技术细节（block-teal）
- 合规声明（block-yellow）

---

## 六、关键约束清单

| 约束 | 实现方式 |
|---|---|
| 无 Mapbox Token | MapPlaceholder 组件：美观占位 + 黄色 banner 提示 |
| 无 Replicate Token | API 返回 mock 图路径，前端展示预设图 |
| 无 Anthropic Key | Behind the AI 页展示静态预跑案例 |
| 合规：不生成爱豆形象 | 生成页合规声明 + prompt 中无爱豆姓名 |
| 移动端响应式 | Tailwind `md:` / `lg:` 前缀全覆盖 |
| localStorage 互动 | like/save 用 useLocalStorage hook |

---

## 七、推送策略

所有代码推送到分支 `claude/determined-fermi-l594c4`。
build 通过后，通过 MCP GitHub 工具推送。
