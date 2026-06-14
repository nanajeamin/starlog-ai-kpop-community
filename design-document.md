# K-Star Spot · 产品设计文档 v1.0

> 文档类型：产品设计文档（兼顾产品逻辑与技术实现）
> 基于：PRD v0.4
> 日期：2026-06-14
> 示例团体：BTS / BLACKPINK / aespa
> 地图方案：Mapbox GL JS
> 生图方案：即梦 / 可灵 / Replicate API

---

## 目录

1. [产品定位](#1-产品定位)
2. [用户与核心需求](#2-用户与核心需求)
3. [产品架构](#3-产品架构)
4. [核心对象设计](#4-核心对象设计)
5. [页面设计](#5-页面设计)
6. [AI 能力设计](#6-ai-能力设计)
7. [数据库设计](#7-数据库设计)
8. [API 接口设计](#8-api-接口设计)
9. [技术架构](#9-技术架构)
10. [指标体系](#10-指标体系)
11. [合规边界](#11-合规边界)
12. [MVP 范围与排期](#12-mvp-范围与排期)

---

## 1. 产品定位

### 1.1 一句话定位

**面向中国韩娱粉丝的「爱豆同款」追星社群** —— 用 AI 把爱豆公开内容拆解成可复刻的「同款」（地点 / 穿搭 / 妆造），让粉丝发现同款、生成同款、打卡同款，并在社群里分享与互动。

### 1.2 产品核心循环

```
爱豆公开内容
      ↓ AI 拆解（Spot Template Agent）
同款模板（地点 / 构图 / 色调 / 姿势）
      ↓ 用户发现（地图）
    ┌─────────────────────┐
    │                     │
线下路线打卡          云同款照生成
    │                     │
    └────────┬────────────┘
             ↓
       晒入同款广场
             ↓
    他人看到 → 一键生成我的同款
             ↓
       更多同款内容
```

### 1.3 差异化定位

| 维度 | Encore | 圆周旅迹 | 生图工具 | K-Star Spot |
|------|--------|---------|---------|-------------|
| K-pop 地图 + 社群 | ✅ | ❌ | ❌ | ✅ |
| AI 内容供给（攻略→模板） | ❌ | 泛旅行 | ❌ | ✅ 饭圈语义 |
| 云同款照生成 | ❌ | ❌ | 泛生图 | ✅ 同款语义 |
| 同款平台扩展（穿搭/妆造） | ❌ | ❌ | 部分 | ✅ 路线图 |
| 同款社群（内容即可复刻） | 打卡社区 | ❌ | ❌ | ✅ 同款社区 |

---

## 2. 用户与核心需求

### 2.1 目标用户

**中国年轻韩娱粉丝，18–30 岁女性**，活跃于小红书、微博、抖音、B 站、饭圈群。

共同特征：
- 追 K-pop 爱豆 / 韩剧演员 / 韩娱综艺
- 强烈收藏「爱豆同款」：地点、穿搭、妆造、照片
- 图片内容生产与分享习惯强（社群成立前提）
- 对 AI 修图 / AI 生图 / AI 规划接受度高
- 双重情绪需求：「我也拥有同款」 + 「晒出来被看见」

### 2.2 用户分层

| 层级 | 画像 | 核心诉求 | 对应功能 |
|------|------|---------|----------|
| L1 线下巡礼型 | 已计划/正在赴韩，结合演唱会/旅行 | 找准地点、规划路线、现场打卡、晒打卡 | 地图、模板详情、路线规划、广场 |
| L2 云巡礼型 | 暂时去不了，有强同款连接+分享需求 | 不到场也能拥有同款照、晒同款 | 云同款生成、热门模板、广场 |

> L1 / L2 是同一需求的两条实现路径，且 L1 现场没拍好会转化为 L2 的生成需求。

### 2.3 用户故事（核心）

**云巡礼型**：作为暂时去不了韩国的粉丝，我希望选择某个爱豆同款地点模板，上传自己的照片生成同款打卡照，发到社群获得「和爱豆同款」的参与感。

**线下巡礼型**：作为准备去首尔看演唱会的粉丝，我希望快速找到我喜欢的团的同款打卡地点，生成一条顺路路线，到现场打卡后发到社群，让同好看到并约我一起去。

**社群浏览型**：作为还没决定打卡的粉丝，我希望在同款广场刷别人晒的同款照和路线，看到喜欢的就一键生成我自己的同款。

---

## 3. 产品架构

### 3.1 一期结构（三大支柱 + 社群贯穿层）

```
┌─────────────────────────────────────────────────────────┐
│                    K-Star Spot                          │
├───────────────┬───────────────┬────────────────────────┤
│  支柱一        │  支柱二        │  支柱三                │
│  圣地巡礼      │  智能路线      │  云同款照              │
│  打卡地图      │  规划         │  生成                  │
│  (P0)         │  (P0 选点式)   │  (P0 Hero)             │
├───────────────┴───────────────┴────────────────────────┤
│              同款追星社群（贯穿层）                       │
│       同款广场 / 打卡动态 / 点赞收藏分享 / UGC 投稿       │
├─────────────────────────────────────────────────────────┤
│           Spot Template Agent（内容供给）                │
│     攻略文本 → 结构化同款模板 → 驱动三支柱               │
└─────────────────────────────────────────────────────────┘
```

### 3.2 体验主动线

```
首页
 │
 ├─→ [支柱一] 圣地巡礼地图 → 发现同款地点 → 点开模板详情
 │                                           │
 │                              ┌────────────┴────────────┐
 │                              ↓                         ↓
 │                    [支柱二] 加入路线              [支柱三] 生成同款照
 │                         ↓                              ↓
 │                    路线规划页                      云同款生成页
 │                         ↓                              ↓
 │                    现场打卡照                      同款照 + 文案
 │                              │                         │
 │                              └────────────┬────────────┘
 │                                           ↓
 └─→ [贯穿层] 同款广场 ←──────── 晒到广场
                  │
                  └─→ 他人「一键生成我的同款」→ 循环
```

### 3.3 页面清单（一期）

| 编号 | 页面 | 优先级 |
|------|------|--------|
| P-01 | 首页 | P0 |
| P-02 | 圣地巡礼地图页 | P0 |
| P-03 | 模板详情页 | P0 |
| P-04 | 云同款生成页 | P0 |
| P-05 | 路线规划页 | P0 |
| P-06 | 同款广场页 | P0 |
| P-07 | Behind the AI 页 | P0 |

---

## 4. 核心对象设计

### 4.1 对象层次

```
Idol Same-Style（爱豆同款）[顶层]
  ├── Idol Spot Template（同款地点）← 一期 P0
  ├── Idol Outfit Template（同款穿搭）← 二期
  └── Idol Look Template（同款妆造）← 三期
```

### 4.2 Idol Spot Template 完整字段

```typescript
interface IdolSpotTemplate {
  template_id: string;
  review_status: 'pending_review' | 'approved' | 'offline';
  created_by: 'ops' | 'user_submission' | 'agent';
  created_at: Date;
  updated_at: Date;
  group_name: string;
  idol_name?: string;
  city: string;
  district: string;
  place_name_cn: string;
  place_name_kr: string;
  place_name_en: string;
  address: string;
  lat: number;
  lng: number;
  place_type: PlaceType;
  spot_reason: string;
  photo_tips: string;
  risk_notes: string;
  source_type: 'official' | 'fan_article' | 'user_submission';
  source_url?: string;
  reference_description: string;
  composition_tags: CompositionTag[];
  style_tags: StyleTag[];
  pose_tags: PoseTag[];
  cloud_generation_prompt: string;
  priority_scores: PriorityScores;
  route_tags: RouteTag[];
  route_cluster: string;
  social_stats: {
    save_count: number;
    generation_count: number;
    checkin_count: number;
    post_count: number;
  };
}
```

### 4.3 枚举类型

```typescript
type PlaceType =
  | 'cafe_restaurant' | 'agency_building' | 'popup_store'
  | 'mv_variety_location' | 'concert_venue' | 'support_ad'
  | 'photo_booth' | 'merch_store' | 'idol_footprint'
  | 'broadcast_station' | 'landmark_street';

type CompositionTag =
  | 'half_body' | 'full_body' | 'close_up'
  | 'front_facing' | 'side_profile' | 'back_view'
  | 'right_side_position' | 'left_side_position' | 'center'
  | 'low_angle' | 'eye_level' | 'high_angle'
  | 'portrait_vertical' | 'landscape_horizontal';

type StyleTag =
  | 'korean_clean' | 'warm_light' | 'cool_tone'
  | 'film_grain' | 'night_scene' | 'golden_hour'
  | 'street_snap' | 'cafe_aesthetic' | 'minimal';

type PoseTag =
  | 'standing' | 'sitting' | 'walking'
  | 'holding_drink' | 'looking_back' | 'looking_away'
  | 'leaning_on_wall' | 'hands_in_pocket';

type RouteTag =
  | 'seongsu_half_day' | 'hongdae_evening' | 'gangnam_agency_route'
  | 'concert_before_jamsil' | 'birthday_cafe_route'
  | 'support_ad_route' | 'photo_spot_route'
  | 'rainy_day_safe' | 'short_distance';

interface PriorityScores {
  idol_relevance_score: number;
  popularity_score: number;
  rarity_score: number;
  photo_quality_score: number;
  freshness_score: number;
  confidence_score: number;
  overall_priority: number;
}
```

---

## 5. 页面设计

### P-01 首页

**目标**：30 秒内让访客理解产品价值，引导进入三支柱任一路径。

```
┌──────────────────────────────┐
│  [Logo] K-Star Spot    [≡]   │  导航栏
├──────────────────────────────┤
│    和爱豆同款                 │
│    从打卡到云巡礼             │  主标题
│  发现同款地点·规划首尔路线      │
│  或上传照片生成同款打卡照      │  副标题
├──────────────────────────────┤
│  [探索首尔同款地图 🗺️]        │  CTA 一
│  [生成我的同款照 ✨]           │  CTA 二（强调色）
│  [逛同款广场 👀]              │  CTA 三
├──────────────────────────────┤
│  公开内容 → Agent → 模板      │
│  → 地图/路线/云同款 → 社群    │  核心链路图
└──────────────────────────────┘
```

---

### P-02 圣地巡礼地图页

**目标**：在地图上发现并筛选爱豆同款地点，点击进入模板详情。

```
┌──────────────────────────────┐
│ ← 返回  圣地巡礼地图   [筛选] │
├──────────────────────────────┤
│ [BTS全] [BLKP] [aespa] [+] → │  团体筛选 chips
│ [全部][进行中][咖啡厅][快闪]→ │  分类筛选 chips
├──────────────────────────────┤
│     【Mapbox 地图区域】        │
│  ◉RM    ◉BLKP  ◉aespa       │  爱豆头像 pin
│      ◉+3个                   │  聚合显示
├──────────────────────────────┤
│ 🎲  [搜索地点...]  📍         │  底部搜索胶囊
└──────────────────────────────┘
```

点击 pin → 半屏地点卡片（地点名 / 爱豆标签 / 打卡理由 / 风格标签 / 社群数据 / 三按钮：加入路线·生成同款·看广场）

---

### P-03 模板详情页

地点基础信息 → 三维标签（构图·色调·姿势）→ 拍照建议 → 风险提示 → 来源可信度 → 社群同款墙（3列网格）→ 底部双按钮（加入路线·生成我的同款）

---

### P-04 云同款生成页（Hero）

**5步 Stepper**：
1. 选择模板（热门同款 / 按团体 / 搜索）
2. 确认同款参数（构图 / 色调 / 姿势 / 风格强度 slider）
3. 上传本人照片（虚线上传框 + 合规说明）
4. 生成中（分步进度动效）
5. 结果展示（2×2 网格）→ 保存 / 生成文案 / 晒广场 / 分享外站

**生成合规原则**：不生成爱豆本人 · 保留用户身份 · 输出标注 AI Generated

---

### P-05 智能巡礼路线规划页

选点 → 配置（出发地 / 可用时间 / 是否有演唱会）→ AI 排序生成路线 → 编号 pin + 连线 + DAY 切换 + 底部时间线 sheet

**排序逻辑（后台）**：地理距离 → 时间约束 → 饭圈时效 → 团体关联度 → 出片时段 → overall_priority

---

### P-06 同款广场页

2列瀑布流 + 团体/类型 tabs + 点赞/收藏/分享 + 反向入口（一键生成我的同款 / 加入我的路线）

P0 交互：点赞 · 收藏 · 分享｜P1 追加：评论 · 关注

---

### P-07 Behind the AI 页

攻略文本 Before → Agent 处理 → 结构化 JSON After + 三维标签体系说明 + 系统架构图 + 评估指标

---

## 6. AI 能力设计

### 6.1 Spot Template Agent

**输入**：攻略文本 | **输出**：IdolSpotTemplate JSON

**实现**：Anthropic claude-sonnet-4-6 + Tool Use（强制 JSON 输出）+ Zod 校验 + 人工审核入库

**System Prompt 核心**：注入 place_type 枚举 / 标签枚举 / 评分标准 / 生成规则（reference_description 只写抽象描述，cloud_generation_prompt 不含爱豆姓名）

**评估指标**：

| 指标 | 目标 |
|------|------|
| POI 识别准确率 | ≥ 90% |
| place_type 准确率 | ≥ 85% |
| 三维标签 F1 | ≥ 0.75 |
| 可入库率 | ≥ 70% |
| 人工修改率 | ≤ 30% |

---

### 6.2 云同款照生成

**API**：Replicate（作品集）→ 即梦/可灵（正式上线）

**Prompt 构建**：`cloud_generation_prompt` + 构图/色调/姿势标签 + 约束（保留用户面部特征，不添加其他人物，photorealistic）

**安全过滤**：NSFW / 明星脸检测 / 输出水印

**评估指标**：身份保持 ≥ 4/5 · 同款感 ≥ 3.5/5 · 生成成功率 ≥ 95% · 晒广场率 ≥ 20%

---

## 7. 数据库设计

**作品集阶段**：静态 JSON / Supabase PostgreSQL

**核心表**：

```sql
idol_groups       -- 团体
idols             -- 成员
spot_templates    -- 同款地点模板（核心，含三维标签 JSONB + priority_scores JSONB）
routes            -- 路线
route_items       -- 路线地点
generation_jobs   -- 生图任务
community_posts   -- 社群帖子
post_interactions -- 点赞/收藏/分享
agent_extraction_logs -- Agent 抽取日志
template_submissions  -- 用户投稿
```

**未来（二期）**：`outfit_templates` · `look_templates` · `tryon_jobs` · `makeup_jobs`

---

## 8. API 接口设计

Base URL: `/api/v1` · JSON · Bearer Token

| 接口 | 说明 |
|------|------|
| GET /templates | 模板列表（group_id / place_type / district 筛选）|
| GET /templates/:id | 模板详情 + 社群帖子 |
| GET /templates/map-pins | 轻量 pin 数据（地图专用）|
| POST /generate/cloud-photo | 提交生成任务 |
| GET /generate/jobs/:id | 轮询生成状态 |
| POST /routes/generate | 生成路线 |
| GET /routes/:id | 路线详情 |
| GET /community/posts | 广场 feed |
| POST /community/posts | 发帖 |
| POST /community/posts/:id/interact | 点赞/收藏/分享 |
| POST /agent/extract | Agent Demo 抽取 |

---

## 9. 技术架构

| 层 | 技术 | 选择理由 |
|----|------|----------|
| 前端框架 | Next.js 14 (App Router) | SSR + API Routes 一体化，Vercel 零配置 |
| 样式 | Tailwind CSS + shadcn/ui | 快速搭建，组件质量高 |
| 地图 | Mapbox GL JS | 视觉精美，自定义 pin 灵活 |
| 类型 | TypeScript | 与 schema 对齐 |
| 数据库 | Supabase PostgreSQL | 免费额度，Storage 一体 |
| LLM | Anthropic claude-sonnet-4-6 | Tool Use 强制 JSON 稳定 |
| 生图 | Replicate API | 模型丰富，按需计费 |
| 部署 | Vercel | push 即上线 |

```
Next.js (Vercel)
  └── API Routes
        ├── Supabase (DB + Storage)
        ├── Anthropic API (LLM 抽取)
        └── Replicate API (图像生成)
Mapbox GL JS（纯前端渲染）
```

---

## 10. 指标体系

| 层级 | 指标 | 目标（MVP）|
|------|------|------------|
| 发现 | 地图 pin 点击率 | ≥ 40% |
| 生成 | 生图启动率 | ≥ 25% |
| 生成 | 生图完成率 | ≥ 80% |
| 社群 | 广场发布率 | ≥ 20% |
| 社群 | 模板复用率 | ≥ 15% |
| 留存 | 路线生成率 | ≥ 50% |
| 社群 | 互动率 | ≥ 30% |

---

## 11. 合规边界

**生成硬约束**：不生成爱豆本人 · 不生成合照 · 不存储/复用原图 · 只用抽象场景描述 · 输出标注 AI Generated · 安全过滤（明星脸/未成年/NSFW）

**供给原则**：作品集阶段人工整理公开文字描述，不做爬虫；MVP 阶段用户授权/合作数据源。

**社群合规**：机审 + 人审抽检 + 举报机制；无打投/集资/控评/应援动员功能。

**产品定位**：旅行工具 + 创意生成工具 + 韩娱同款社群（非饭圈组织工具）

---

## 12. MVP 范围与排期

**P0 包含**：首页 · 地图（首尔 + BTS/BLACKPINK/aespa + 15–20模板）· 模板详情 · 云同款生成（Replicate，1–2真实样例 + mock）· 选点路线规划 · 同款广场（种子内容 + 轻互动）· Behind the AI（真实 Agent 样例）

**不包含**：即时聊天/找搭子 · 真实用户注册系统 · 自动爬虫 · 二期穿搭/妆造

### 排期

| 阶段 | 产出 | 估时 |
|------|------|------|
| 0. 环境搭建 | Next.js + Tailwind + Mapbox | 0.5天 |
| 1. 数据准备 | 15–20个模板 JSON | 1天 |
| 2. Agent 样例 | Anthropic API 真实抽取 | 1天 |
| 3. 首页 + 地图 | P-01 + P-02 | 1.5天 |
| 4. 模板详情 | P-03 | 0.5天 |
| 5. 云同款生成 | P-04 | 1.5天 |
| 6. 路线规划 | P-05 | 1天 |
| 7. 同款广场 | P-06 | 1天 |
| 8. Behind the AI | P-07 | 0.5天 |
| 9. 打磨 + 部署 | Vercel | 1天 |
| **合计** | | **~9天** |

**时间紧时优先级**：首页 → 地图+模板卡 → 云同款生成 → 同款广场 → 路线规划 → Agent 样例 → Behind the AI

---

## 附录：Seed 数据示例

```json
[
  {
    "template_id": "tpl_bts_rm_seongsu_cafe_001",
    "group_name": "BTS",
    "idol_name": "RM",
    "city": "Seoul",
    "district": "Seongsu",
    "place_name_cn": "圣水洞白色咖啡馆",
    "place_name_kr": "성수동 화이트 카페",
    "place_name_en": "Seongsu White Cafe",
    "place_type": "cafe_restaurant",
    "spot_reason": "RM 2024年 ins 公开照片同款地点，门口白墙和玻璃窗适合半身街拍",
    "composition_tags": ["half_body", "front_facing", "right_side_position"],
    "style_tags": ["korean_clean", "warm_light", "street_snap"],
    "pose_tags": ["standing", "holding_drink"],
    "photo_tips": "建议下午3-5点自然光拍摄，人物站在门口右侧，竖构图半身照",
    "risk_notes": "周末需提前预约，排队约1小时",
    "cloud_generation_prompt": "Realistic Korean street snap portrait at a white minimalist cafe entrance with warm natural light, person standing right side of glass door, half body shot, vertical composition",
    "route_tags": ["seongsu_half_day", "cafe_hopping", "photo_spot_route"],
    "priority_scores": {
      "idol_relevance_score": 0.85,
      "popularity_score": 0.78,
      "rarity_score": 0.45,
      "photo_quality_score": 0.90,
      "freshness_score": 0.70,
      "confidence_score": 0.82,
      "overall_priority": 0.80
    },
    "social_stats": { "save_count": 238, "generation_count": 156, "checkin_count": 56, "post_count": 89 },
    "review_status": "approved",
    "created_by": "ops"
  }
]
```

---

*设计文档 v1.0 · K-Star Spot · 基于 PRD v0.4*
