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
|------|------|---------|---------|
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
  // 基础标识
  template_id: string;
  review_status: 'pending_review' | 'approved' | 'offline';
  created_by: 'ops' | 'user_submission' | 'agent';
  created_at: Date;
  updated_at: Date;

  // 爱豆关联
  group_name: string;           // e.g. "BTS"
  idol_name?: string;           // e.g. "RM" | null（团体级别）

  // 地点信息
  city: string;                 // e.g. "Seoul"
  district: string;             // e.g. "Seongsu"
  place_name_cn: string;
  place_name_kr: string;
  place_name_en: string;
  address: string;
  lat: number;
  lng: number;

  // 地点分类（维度一）
  place_type: PlaceType;

  // 打卡信息
  spot_reason: string;          // 为什么值得打卡
  photo_tips: string;           // 拍照建议
  risk_notes: string;           // 营业/排队/限时风险

  // 内容来源（不存储原图）
  source_type: 'official' | 'fan_article' | 'user_submission';
  source_url?: string;
  reference_description: string; // 对参考图的抽象描述

  // 同款生成标签（维度一的细化）
  composition_tags: CompositionTag[];  // 构图标签
  style_tags: StyleTag[];              // 风格标签
  pose_tags: PoseTag[];                // 姿势标签

  // 云同款生成
  cloud_generation_prompt: string;

  // 重要度（维度二，内部使用）
  priority_scores: PriorityScores;

  // 路线串联（维度三）
  route_tags: RouteTag[];
  route_cluster: string;

  // 社群统计
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
  | 'cafe_restaurant'       // 咖啡店 / 餐厅
  | 'agency_building'       // 公司 / 事务所楼
  | 'popup_store'           // 快闪店 / POP-UP
  | 'mv_variety_location'   // MV / 综艺 / 写真取景地
  | 'concert_venue'         // 演唱会 / 打歌场馆
  | 'support_ad'            // 应援广告位
  | 'photo_booth'           // 拍贴机
  | 'merch_store'           // 周边商店
  | 'idol_footprint'        // 偶像足迹
  | 'broadcast_station'     // 电视台
  | 'landmark_street';      // 街区 / 地标

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
  idol_relevance_score: number;  // 0-1，与爱豆关联强度
  popularity_score: number;      // 0-1，粉丝热度
  rarity_score: number;          // 0-1，稀缺性（限时/快闪）
  photo_quality_score: number;   // 0-1，出片质量
  freshness_score: number;       // 0-1，新鲜度
  confidence_score: number;      // 0-1，信息可信度
  overall_priority: number;      // 加权综合分
}
```

---

## 5. 页面设计

### P-01 首页

**目标**：30 秒内让访客理解产品价值，引导进入三支柱任一路径。

**布局（移动端）**：

```
┌──────────────────────────────┐
│  [Logo] K-Star Spot    [≡]   │  导航栏
├──────────────────────────────┤
│                              │
│    和爱豆同款                 │
│    从打卡到云巡礼             │  主标题（大字）
│                              │
│  发现同款地点·规划首尔路线      │
│  或上传照片生成同款打卡照      │  副标题
│  和同好一起晒同款              │
│                              │
├──────────────────────────────┤
│                              │
│  [探索首尔同款地图 🗺️]        │  CTA 按钮一（满宽）
│                              │
│  [生成我的同款照 ✨]           │  CTA 按钮二（满宽，强调色）
│                              │
│  [逛同款广场 👀]              │  CTA 按钮三（满宽）
│                              │
├──────────────────────────────┤
│  AI 如何工作                  │  折叠区
│  公开内容 → Agent → 模板      │
│  → 地图/路线/云同款 → 社群    │
└──────────────────────────────┘
```

**交互状态**：
- 首次访问：显示三按钮，无需登录即可体验地图和广场
- 未登录点击「生成我的同款照」：弹出轻提示引导注册（不强制）
- 背景：首尔城市夜景（静态图），叠加半透明暗底遮罩

---

### P-02 圣地巡礼地图页

**目标**：在地图上发现并筛选爱豆同款地点，点击进入模板详情。

**布局（移动端）**：

```
┌──────────────────────────────┐
│ ← 返回  圣地巡礼地图   [筛选] │  顶部导航
├──────────────────────────────┤
│ [BTS全] [BLKP] [aespa] [+] → │  团体筛选 chips（可横滑）
│ [全部][进行中][咖啡厅][快闪]→ │  分类筛选 chips（可横滑）
├──────────────────────────────┤
│                              │
│     【Mapbox 地图区域】        │
│                              │
│  ◉RM    ◉BLKP  ◉aespa       │  圆形爱豆头像 pin
│      ◉+3个                   │  密集处聚合
│                              │
│  ◉BTS                        │
│                              │
│                              │
├──────────────────────────────┤
│ 🎲  [搜索地点...]  📍         │  底部搜索胶囊
└──────────────────────────────┘
```

**点击 pin → 半屏地点卡片**：

```
┌──────────────────────────────┐
│  ━━━━  （拖拽把手）           │
│                              │
│  [RM 头像] BTS · RM          │
│  圣水洞白色咖啡馆              │  地点名 + 爱豆标签
│  📍 Seongsu · cafe_restaurant│
│                              │
│  [抽象参考图 mock 图]         │  图片区
│                              │
│  「RM 2024 ins 同款，门口白墙  │
│  玻璃窗适合半身街拍」          │  打卡理由
│                              │
│  #韩系清透  #暖光  #半身照    │  标签
│  ✅ 来源可信 · 粉丝攻略核验    │
│  💫 238人生成同款  📍 56人打卡 │
│                              │
│ [加入路线]  [生成同款]  [看广场]│  三按钮
└──────────────────────────────┘
```

**筛选逻辑**：
- 团体 chips 单选（默认「全部」），选中后地图只显示该团 pin
- 分类 chips 多选，与团体筛选取交集
- 「进行中」= `rarity_score > 0.5` 且 `freshness_score > 0.6` 的限时地点
- pin 点击打开半屏卡片，再点「查看详情」进 P-03

---

### P-03 模板详情页

**目标**：展示同款地点的完整信息，引导生成同款或加入路线。

**布局（移动端）**：

```
┌──────────────────────────────┐
│ ←  圣水洞白色咖啡馆   [分享]  │
├──────────────────────────────┤
│                              │
│    [地点抽象参考图 / mock]    │  顶部图片（16:9）
│    [BTS · RM]  [Seongsu]     │  浮层标签
│                              │
├──────────────────────────────┤
│ 📍 圣水咖啡 · 首尔 · 圣水洞   │
│ 🏷️ 咖啡店 / 餐厅             │
├──────────────────────────────┤
│ 为什么值得打卡                │  Section
│ RM 2024年 ins 公开照片同款    │
│ 地点，门口白墙和玻璃窗...      │
├──────────────────────────────┤
│ 同款构图 · 色调 · 姿势         │  Section（三维标签）
│ [半身] [正面] [人物靠右]      │  构图
│ [韩系清透] [暖光] [街拍风]    │  色调
│ [站姿] [拿咖啡]              │  姿势
├──────────────────────────────┤
│ 拍照建议                      │
│ 建议下午3-5点自然光拍摄...     │
├──────────────────────────────┤
│ ⚠️ 风险提示                   │
│ 需要提前预约，周末排队约1h     │
├──────────────────────────────┤
│ 来源可信度  ★★★★☆            │
│ 粉丝攻略 · 多方核验            │
├──────────────────────────────┤
│ 社群同款墙（该地点的打卡照）   │  3列网格，最多9张
│ [图] [图] [图]               │
│ [图] [图] [图]               │
│          查看全部 →           │
├──────────────────────────────┤
│ [加入路线  ＋]  [生成我的同款 ✨]│  底部双按钮（fixed）
└──────────────────────────────┘
```

---

### P-04 云同款生成页（Hero）

**目标**：让用户上传本人照片，生成与爱豆同款地点、构图、氛围一致的打卡照。

**流程（分步 Stepper）**：

```
Step 1: 选择模板
  ↓
Step 2: 确认同款参数
  ↓
Step 3: 上传本人照片
  ↓
Step 4: 生成中（Loading）
  ↓
Step 5: 结果展示 + 分享
```

**Step 1 — 选择模板**：

```
┌──────────────────────────────┐
│ ← 返回  生成我的同款照  1/5   │
├──────────────────────────────┤
│ 选择同款模板                  │
├──────────────────────────────┤
│ 热门同款                     │
│ [BTS·RM·圣水咖啡馆]  [BLKP·  │
│  [aespa·同款街道]   Hannam·  │  横滑卡片
│                    咖啡馆]   │
│                              │
│ 按团体浏览                   │
│ [BTS] [BLACKPINK] [aespa]   │
│                              │
│ 🔍 搜索地点或成员...          │
└──────────────────────────────┘
```

**Step 2 — 确认同款参数**：

```
┌──────────────────────────────┐
│ ← 返回  生成我的同款照  2/5   │
├──────────────────────────────┤
│ 已选：BTS · RM · 圣水咖啡馆  │
│ [地点抽象描述图]             │
│                              │
│ 同款参数（可调整）            │
│ 构图: [半身✓] [全身] [特写]  │
│ 色调: [韩系清透✓][暖光] [冷调]│
│ 姿势: [拿咖啡✓][站姿][靠墙] │
│                              │
│ 风格强度: ●●●●○ (强)         │  slider
│                              │
│          [下一步 →]          │
└──────────────────────────────┘
```

**Step 3 — 上传照片**：

```
┌──────────────────────────────┐
│ ← 返回  生成我的同款照  3/5   │
├──────────────────────────────┤
│ 上传你的照片                  │
│                              │
│ ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐  │
│   拖拽或点击上传             │  虚线圆角上传框
│   建议：正面照，光线充足       │
│   支持 JPG / PNG，≤10MB     │
│ └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘  │
│                              │
│ ✅ 你的照片仅用于本次生成     │
│ ✅ 生成结果不含爱豆本人形象   │
│ ✅ 输出结果标注 AI 生成       │
│                              │
│          [开始生成 ✨]        │
└──────────────────────────────┘
```

**Step 4 — 生成中**：

```
┌──────────────────────────────┐
│      AI 正在生成同款照...     │
│                              │
│   [动效加载圈 / 进度条]       │
│                              │
│   正在理解同款场景...  ✅     │
│   正在调整构图色调...  ⏳     │
│   正在生成你的同款照...       │
│                              │
│   预计 15–30 秒              │
└──────────────────────────────┘
```

**Step 5 — 结果展示**：

```
┌──────────────────────────────┐
│ 你的同款照出炉了！            │
├──────────────────────────────┤
│ [同款照 1]  [同款照 2]       │  2×2 网格
│ [同款照 3]  [同款照 4]       │
│                              │
│ 📝 AI Generated · K-Star Spot│  标注
├──────────────────────────────┤
│ 生成文案（可编辑）            │
│ 「在 RM 同款的咖啡馆里，感觉  │
│  自己也是首尔 girl ✨         │
│  #BTS #同款打卡 #首尔圣水洞」 │
│                              │
│ [保存到相册]  [晒到同款广场 →]│
│                              │
│ [分享到小红书] [分享到微博]   │
│                              │
│ [重新生成]  [换个模板]        │
└──────────────────────────────┘
```

**生成原则（合规硬约束）**：
- 生成对象始终是用户本人，不生成爱豆本人
- 不生成与爱豆的合照
- 不复用爱豆原图像素，仅使用抽象描述
- 输出结果必须标注「AI Generated · K-Star Spot」
- 安全过滤：屏蔽明星脸、未成年人、敏感内容

---

### P-05 智能巡礼路线规划页

**目标**：将用户选择的同款地点，按饭圈语义排序，生成可执行的巡礼路线。

**流程**：地图/模板页选点 → 路线配置 → 生成路线 → 查看编辑

**路线配置（底部 Sheet）**：

```
┌──────────────────────────────┐
│  ━━━━  已选 4 个地点          │
│                              │
│  📍 圣水咖啡馆 · RM           │
│  📍 SMTOWN 商店 · aespa       │  已选地点列表（可删除）
│  📍 汉江公园 · BTS            │
│  📍 应援广告·弘大地铁 · BLKP  │
│                              │
│  出发地: [_______________]   │
│  结束地: [_______________]   │
│  可用时间: [半天▾] [一天▾]   │
│  是否有演唱会: ○是  ●否       │
│                              │
│         [生成巡礼路线 ✨]     │
└──────────────────────────────┘
```

**路线结果页**：

```
┌──────────────────────────────┐
│ ←  我的首尔圣地路线   [分享]  │
│ [总览] [DAY 1] [DAY 2]       │  DAY 切换
├──────────────────────────────┤
│                              │
│   【Mapbox 地图】             │
│   ①──②──③──④               │  编号 pin + 连线
│   (DAY1 5.2km / 约3h)        │  距离 + 时间标注
│                              │
├──────────────────────────────┤
│  DAY 1 路线                  │
│  ① 圣水咖啡馆                │
│    RM 同款 · 建议 14:00-15:00 │
│    📸 半身照 · 门口右侧       │
│    → 步行 8 分钟             │
│  ② SMTOWN 商店               │
│    aespa 同款 · 周边购买      │
│    …                         │
│                              │
│  [推荐地点] 开关 ○           │
│                      [编辑路线]│
└──────────────────────────────┘
```

**路线排序逻辑（后台，不暴露给用户）**：

1. 地理距离（减少跨区）
2. 时间约束（营业时间 / 快闪截止 / 演唱会开场）
3. 饭圈时效（生日应援 / 限时广告优先）
4. 团体相关度（同团同成员优先串联）
5. 出片时段（按 style_tags 光线调顺序）
6. `overall_priority` 取舍
7. 风险提示前置

---

### P-06 同款广场页

**目标**：展示用户晒的同款照和路线，形成「看到→复刻」的社群循环。

**布局（移动端）**：

```
┌──────────────────────────────┐
│ ← 返回   同款广场    [投稿+]  │
├──────────────────────────────┤
│ [全部] [BTS] [BLACKPINK] [aespa]→│  团体 tabs
│ [全部同款] [同款照] [巡礼路线]│  类型 tabs
├──────────────────────────────┤
│                              │
│  [图] [图]    [图] [图]      │  2列瀑布流
│  [路线卡]     [图] [图]      │
│  [图] [图]    [路线卡]       │
│                              │
└──────────────────────────────┘
```

**广场卡片（同款照）**：

```
┌──────────────┐
│              │
│   [同款照]   │
│              │
│ RM · 圣水咖啡│  爱豆 + 地点标签
├──────────────┤
│ ♥ 128  🔖 34 │  点赞 + 收藏数
│ [一键生成同款]│  反向入口（核心）
└──────────────┘
```

**广场卡片（路线）**：

```
┌──────────────┐
│ 📍─📍─📍─📍  │  迷你路线地图
│ BTS首尔1日游 │
├──────────────┤
│ 4个地点·约6h │
│ ♥ 56  🔖 23  │
│[加入我的路线] │
└──────────────┘
```

**P0 交互范围**：
- 点赞（双击图片 / 点心形图标）
- 收藏（书签图标）
- 分享（系统分享 sheet）
- 「一键生成我的同款」→ 跳到 P-04 Step 2，预填模板
- 「加入我的路线」→ 跳到 P-05 路线配置，预填地点

> P1 后追加：评论、关注用户、打卡图鉴、贡献者主页

---

### P-07 Behind the AI 页

**目标**：向面试官/用户展示 AI 工作机制，建立产品可信度。

**布局**：

```
┌──────────────────────────────┐
│ ← 返回     AI 是如何工作的   │
├──────────────────────────────┤
│ Spot Template Agent          │
│                              │
│ 系统如何把散落的粉丝攻略      │
│ 变成结构化的「同款模板」？    │
├──────────────────────────────┤
│ Before  攻略文本（原始）      │
│ ┌─────────────────────────┐  │
│ │「RM最近更新ins，是在圣水  │  │
│ │ 洞一家白色咖啡馆门口拍的  │  │
│ │ 照片，半身，暖光...」    │  │
│ └─────────────────────────┘  │
│              ↓ Agent 处理    │
│ After   结构化模板 JSON       │
│ ┌─────────────────────────┐  │
│ │ group_name: "BTS"       │  │
│ │ idol_name: "RM"         │  │
│ │ place_type: "cafe_…"    │  │
│ │ composition_tags: [     │  │
│ │   "half_body",          │  │
│ │   "right_side_position" │  │
│ │ ]                       │  │
│ │ style_tags: [           │  │
│ │   "korean_clean",       │  │
│ │   "warm_light"          │  │
│ │ ]                       │  │
│ │ overall_priority: 0.80  │  │
│ └─────────────────────────┘  │
├──────────────────────────────┤
│ 三维标签体系                  │
│ 维度一：地点类型（11种）      │
│ 维度二：重要度评分（6维加权） │
│ 维度三：路线串联标签（9类）   │
├──────────────────────────────┤
│ 系统架构图                    │
│ [攻略文本] → [LLM] → [模板]  │
│     → [地图/路线/云同款/社群] │
└──────────────────────────────┘
```

---

## 6. AI 能力设计

### 6.1 Spot Template Agent

**输入**：攻略文本（用户粘贴或运营提供）

**输出**：`IdolSpotTemplate` JSON

**实现方案**：

```
攻略文本
   ↓
LLM（Claude / GPT-4）
  · System Prompt 注入饭圈知识库
  · JSON Mode / Function Calling
  · Fixed Schema（IdolSpotTemplate）
   ↓
字段校验（Zod schema validation）
   ↓
人工审核 → 入库
```

**System Prompt 核心结构**：

```
你是一个韩娱粉丝攻略分析专家。从下面的攻略文本中提取结构化同款地点模板。

知识库：
- place_type 枚举：[11种类型及说明]
- composition_tags 枚举：[构图标签及说明]
- style_tags 枚举：[风格标签及说明]
- pose_tags 枚举：[姿势标签及说明]
- route_tags 枚举：[路线标签及说明]
- priority_scores 评分标准：[各维度评分说明]

生成规则：
1. reference_description 只写场景抽象描述，不复制原图像素信息
2. cloud_generation_prompt 用英文写，只描述场景/构图/氛围，不提爱豆姓名
3. confidence_score 根据来源类型评分：官方认证>多方粉丝>单一粉丝>推测
4. 无法确定的字段填 null，不要猜测

输出 JSON，符合 IdolSpotTemplate schema。
```

**评估指标**：

| 指标 | 定义 | 目标 |
|------|------|------|
| POI 识别准确率 | 提取地点名称是否正确 | ≥ 90% |
| 爱豆关联准确率 | group_name / idol_name 是否正确 | ≥ 95% |
| place_type 准确率 | 分类是否合理 | ≥ 85% |
| 三维标签 F1 | 标签召回+精确率 | ≥ 0.75 |
| 可入库率 | 人审通过率 | ≥ 70% |
| 人工修改率 | 需要人工修改的字段比例 | ≤ 30% |

---

### 6.2 云同款照生成

**技术方案**：

```
用户照片（本人）
    +
模板同款参数（scene/composition/style/pose）
    ↓
云同款生成 Prompt 构建
    ↓
图像生成 API（即梦 / 可灵 / Replicate）
  · 使用 portrait-style ControlNet / IP-Adapter
  · 参考：构图标签 + 色调标签 + 姿势标签
  · 约束：不添加其他人物，保留用户身份特征
    ↓
安全过滤（NSFW / 明星脸检测）
    ↓
输出结果（1-4 张）+ AI 标注水印
```

**Prompt 模板**：

```
{cloud_generation_prompt}

User portrait: [uploaded image reference]
Composition: {composition_tags joined}
Style: {style_tags joined}
Pose: {pose_tags joined}
Style strength: {0.6-0.9}

Constraints: realistic Korean street photography style,
preserve the user's facial identity,
no additional people,
natural lighting,
photorealistic.
```

**API 选型对比**（作品集阶段推荐 Replicate）：

| API | 优势 | 适合场景 |
|-----|------|---------|
| Replicate | 模型丰富、按需付费、文档完善 | 作品集 Demo，灵活选模型 |
| 即梦（字节）| 中文友好，Portrait 效果好 | 正式上线 |
| 可灵（快手）| 视频+图像，生态好 | 正式上线 |

**评估指标**：

| 指标 | 定义 | 目标 |
|------|------|------|
| 身份保持评分 | 面部相似度（SSIM/人工评） | ≥ 4/5 |
| 同款感评分 | 与模板描述的风格一致性 | ≥ 3.5/5 |
| 生成成功率 | API 成功返回率 | ≥ 95% |
| 保存率 | 生成后保存到本地的比例 | ≥ 60% |
| 晒广场率 | 生成后发到广场的比例 | ≥ 20% |

---

## 7. 数据库设计

### 7.1 核心表结构

**作品集阶段**：静态 JSON 文件 / Supabase PostgreSQL

```sql
-- 团体表
CREATE TABLE idol_groups (
  id UUID PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  name_kr VARCHAR(50),
  avatar_url TEXT,
  agency VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 成员表
CREATE TABLE idols (
  id UUID PRIMARY KEY,
  group_id UUID REFERENCES idol_groups(id),
  name VARCHAR(50) NOT NULL,
  name_kr VARCHAR(50),
  avatar_url TEXT
);

-- 同款地点模板表（核心）
CREATE TABLE spot_templates (
  id UUID PRIMARY KEY,
  group_id UUID REFERENCES idol_groups(id),
  idol_id UUID REFERENCES idols(id),
  city VARCHAR(50),
  district VARCHAR(50),
  place_name_cn VARCHAR(100),
  place_name_kr VARCHAR(100),
  place_name_en VARCHAR(100),
  address TEXT,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  place_type VARCHAR(50),
  spot_reason TEXT,
  reference_description TEXT,
  composition_tags JSONB,   -- string[]
  style_tags JSONB,         -- string[]
  pose_tags JSONB,          -- string[]
  photo_tips TEXT,
  risk_notes TEXT,
  source_type VARCHAR(50),
  source_url TEXT,
  priority_scores JSONB,    -- PriorityScores object
  route_tags JSONB,         -- string[]
  route_cluster VARCHAR(100),
  cloud_generation_prompt TEXT,
  review_status VARCHAR(20) DEFAULT 'pending_review',
  created_by VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 路线表
CREATE TABLE routes (
  id UUID PRIMARY KEY,
  user_id UUID,
  title VARCHAR(100),
  city VARCHAR(50),
  day_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 路线地点表
CREATE TABLE route_items (
  id UUID PRIMARY KEY,
  route_id UUID REFERENCES routes(id),
  template_id UUID REFERENCES spot_templates(id),
  day_number INTEGER,
  order_index INTEGER,
  stop_duration_min INTEGER,
  notes TEXT
);

-- 生成任务表
CREATE TABLE generation_jobs (
  id UUID PRIMARY KEY,
  user_id UUID,
  template_id UUID REFERENCES spot_templates(id),
  status VARCHAR(20),          -- pending/processing/done/failed
  input_params JSONB,
  result_urls JSONB,           -- string[]
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 社群帖子表
CREATE TABLE community_posts (
  id UUID PRIMARY KEY,
  user_id UUID,
  post_type VARCHAR(20),       -- 'photo' | 'route'
  template_id UUID REFERENCES spot_templates(id),
  route_id UUID REFERENCES routes(id),
  generation_job_id UUID REFERENCES generation_jobs(id),
  image_urls JSONB,            -- string[]
  caption TEXT,
  like_count INTEGER DEFAULT 0,
  save_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 社群互动表
CREATE TABLE post_interactions (
  id UUID PRIMARY KEY,
  user_id UUID,
  post_id UUID REFERENCES community_posts(id),
  action VARCHAR(20),          -- 'like' | 'save' | 'share'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id, action)
);

-- Agent 抽取日志表
CREATE TABLE agent_extraction_logs (
  id UUID PRIMARY KEY,
  input_text TEXT,
  output_json JSONB,
  validation_errors JSONB,
  template_id UUID REFERENCES spot_templates(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 用户投稿表
CREATE TABLE template_submissions (
  id UUID PRIMARY KEY,
  user_id UUID,
  raw_content TEXT,
  source_url TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  extracted_template_id UUID REFERENCES spot_templates(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 7.2 社群统计更新策略

```
社群统计（spot_templates.social_stats）采用以下方式维护：

作品集阶段：手动更新静态字段
MVP 阶段：
  - 每次 community_posts 插入：template.post_count++
  - 每次 generation_jobs 完成：template.generation_count++
  - 每次 post_interactions 点赞：post.like_count++（触发器）
```

---

## 8. API 接口设计

### 8.1 接口规范

- Base URL: `/api/v1`
- 格式: JSON
- 认证: Bearer Token（MVP 阶段可 mock）
- 错误码: 标准 HTTP + `{ code, message, data }` 结构

### 8.2 地图 & 模板接口

```
GET /api/v1/templates
  Query: group_id, place_type, district, sort_by(priority|freshness)
  Response: { templates: IdolSpotTemplate[], total: number }

GET /api/v1/templates/:id
  Response: { template: IdolSpotTemplate, community_posts: CommunityPost[] }

GET /api/v1/templates/map-pins
  Query: group_id, place_type, bounds(sw_lat,sw_lng,ne_lat,ne_lng)
  Response: { pins: MapPin[] }  // 轻量级，只含 id/lat/lng/group/type
```

### 8.3 云同款生成接口

```
POST /api/v1/generate/cloud-photo
  Body: {
    template_id: string,
    params: {
      composition_tags: string[],
      style_tags: string[],
      pose_tags: string[],
      style_strength: number  // 0.6-0.9
    }
  }
  // 注：用户照片通过 multipart/form-data 单独上传
  Response: { job_id: string, status: 'pending' }

GET /api/v1/generate/jobs/:job_id
  Response: {
    status: 'pending' | 'processing' | 'done' | 'failed',
    result_urls?: string[]
  }
```

### 8.4 路线接口

```
POST /api/v1/routes/generate
  Body: {
    template_ids: string[],
    start_location?: string,
    end_location?: string,
    available_hours: number,
    has_concert: boolean
  }
  Response: { route: Route }

GET /api/v1/routes/:id
  Response: { route: Route, items: RouteItem[] }
```

### 8.5 社群接口

```
GET /api/v1/community/posts
  Query: group_id, post_type, template_id, cursor, limit
  Response: { posts: CommunityPost[], next_cursor: string }

POST /api/v1/community/posts
  Body: {
    post_type: 'photo' | 'route',
    template_id?: string,
    route_id?: string,
    generation_job_id?: string,
    caption: string
  }
  Response: { post: CommunityPost }

POST /api/v1/community/posts/:id/interact
  Body: { action: 'like' | 'save' | 'share' }
  Response: { success: boolean, counts: { like_count, save_count } }
```

### 8.6 Agent Demo 接口

```
POST /api/v1/agent/extract
  Body: { raw_text: string }
  Response: {
    extracted_template: Partial<IdolSpotTemplate>,
    validation_result: { valid: boolean, errors: string[] },
    log_id: string
  }
```

---

## 9. 技术架构

### 9.1 技术选型

| 层 | 技术 | 选择理由 |
|----|------|---------|
| 前端框架 | Next.js 14 (App Router) | SSR + API Routes 一体化，Vercel 部署零配置 |
| 样式 | Tailwind CSS + shadcn/ui | 快速搭建，组件质量高 |
| 地图 | Mapbox GL JS | 视觉效果精美，自定义 pin 灵活 |
| 类型 | TypeScript | 类型安全，与 schema 对齐 |
| 数据库 | Supabase（PostgreSQL） | 免费额度，实时订阅，Storage 一体 |
| AI/LLM | Anthropic Claude API（claude-sonnet-4-6） | 结构化抽取能力强，JSON Mode 稳定 |
| 生图 | Replicate API（作品集） | 模型丰富，按需计费 |
| 图片存储 | Supabase Storage | 与数据库同一平台，免运维 |
| 部署 | Vercel | 自动 CI/CD，边缘网络 |

### 9.2 系统架构图

```
用户浏览器
    │
    ↓
Next.js App (Vercel)
  ├── /app/*         前端页面（RSC + Client Component）
  └── /api/v1/*      API Routes（Serverless Function）
         │
    ┌────┴─────────────────────────────┐
    │                                  │
 Supabase                      外部 AI API
  ├── PostgreSQL（数据）         ├── Anthropic Claude（LLM 抽取）
  ├── Storage（图片）            └── Replicate（图像生成）
  └── Auth（用户）
         │
    Mapbox GL JS（地图渲染，纯前端）
```

### 9.3 关键技术实现

**Mapbox 自定义 Pin**：

```tsx
// 使用 Mapbox GL JS Marker + 爱豆头像
const marker = new mapboxgl.Marker({
  element: createIdolPinElement(idol.avatar_url, idol.group_name)
}).setLngLat([template.lng, template.lat])
  .addTo(map);

function createIdolPinElement(avatarUrl: string, groupName: string) {
  const el = document.createElement('div');
  el.className = 'idol-pin';
  el.innerHTML = `
    <img src="${avatarUrl}" class="w-10 h-10 rounded-full border-2 border-white shadow-md" />
    <span class="text-xs font-medium mt-1">${groupName}</span>
  `;
  return el;
}
```

**LLM 抽取（JSON Mode）**：

```typescript
// /api/v1/agent/extract
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function extractSpotTemplate(rawText: string) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{
      role: 'user',
      content: `${SYSTEM_PROMPT}\n\n攻略文本：\n${rawText}\n\n请输出符合 schema 的 JSON：`
    }],
    // 使用 tool use 强制 JSON 输出
    tools: [{
      name: 'create_spot_template',
      description: '创建同款地点模板',
      input_schema: IDOL_SPOT_TEMPLATE_SCHEMA
    }],
    tool_choice: { type: 'tool', name: 'create_spot_template' }
  });

  const toolUse = response.content.find(c => c.type === 'tool_use');
  return toolUse?.input as Partial<IdolSpotTemplate>;
}
```

**生图 API 调用（Replicate）**：

```typescript
// /api/v1/generate/cloud-photo
import Replicate from 'replicate';

const replicate = new Replicate();

export async function generateCloudPhoto(
  userImageUrl: string,
  template: IdolSpotTemplate,
  params: GenerationParams
) {
  const prompt = buildGenerationPrompt(template, params);

  const output = await replicate.run(
    'stability-ai/stable-diffusion-img2img:...',
    {
      input: {
        image: userImageUrl,
        prompt,
        negative_prompt: 'celebrity face, other people, blur, low quality',
        strength: params.style_strength,
        num_outputs: 4
      }
    }
  );

  return output as string[];
}
```

---

## 10. 指标体系

### 10.1 产品核心指标

| 层级 | 指标 | 定义 | 目标（MVP） |
|------|------|------|------------|
| 发现 | 地图 pin 点击率 | 点击 pin / 地图访问 | ≥ 40% |
| 生成 | 生图启动率 | 进入生成页 / 模板详情页 | ≥ 25% |
| 生成 | 生图完成率 | 完成生成 / 启动生成 | ≥ 80% |
| 社群 | 广场发布率 | 生成后晒出 / 完成生成 | ≥ 20% |
| 社群 | 模板复用率 | 看到他人同款后生成 / 广场访问 | ≥ 15% |
| 留存 | 路线生成率 | 生成路线 / 选点行为 | ≥ 50% |
| 社群 | 互动率 | 点赞+收藏 / 广场帖浏览 | ≥ 30% |

### 10.2 AI 能力指标

**Agent 侧**：

| 指标 | 样本 | 评估方式 |
|------|------|---------|
| POI 识别准确率 | 20条攻略 | 人工标注对比 |
| place_type 准确率 | 20条攻略 | 人工标注对比 |
| 三维标签 F1 | 20条攻略 | 人工标注对比 |
| 可入库率 | 20条攻略 | 人审通过数/总数 |

**生图侧**：

| 指标 | 样本 | 评估方式 |
|------|------|---------|
| 身份保持评分（1-5） | 5个样例 | 人工评估 |
| 同款感评分（1-5） | 5个样例 | 人工评估 |
| 生成成功率 | 10次调用 | API 返回率 |

---

## 11. 合规边界

### 11.1 生成内容原则（硬约束）

1. 不生成爱豆本人形象
2. 不生成用户与爱豆的合照
3. 不伪造爱豆出现在新场景
4. 不存储 / 不复用 / 不二次分发爱豆原图
5. 参考内容只用于提取抽象描述（场景 / 构图 / 色调 / 姿势）
6. 生成对象始终是用户本人
7. 所有生成结果必须标注「AI Generated · K-Star Spot」
8. 安全过滤：屏蔽明星脸、未成年人、NSFW 内容

### 11.2 内容供给原则

1. 作品集阶段：只用人工整理的公开文字描述，不做爬虫
2. MVP 阶段：用户授权上传 / 合作数据源 / 官方授权素材
3. Agent 只处理抽象层面，不存储原图

### 11.3 社群合规

1. UGC 审核：机审（NSFW 过滤）+ 人审抽检
2. 举报机制（P1 实现）
3. 不做饭圈组织工具：无打投、集资、控评、应援动员功能

### 11.4 产品定位

**是**：旅行工具 + 创意生成工具 + 韩娱同款社群

**不是**：饭圈组织工具 / 应援动员平台 / 明星肖像生成工具

---

## 12. MVP 范围与排期

### 12.1 作品集 Demo 范围

**包含（P0）**：
- 首页（三支柱入口 + 核心链路图）
- 圣地巡礼地图（首尔 + BTS/BLACKPINK/aespa + 15-20个模板）
- 模板详情页
- 云同款生成（接 Replicate API，1-2个真实样例 + mock）
- 选点式路线规划（交互真，连线可 mock）
- 同款广场（种子内容 + 真实生成结果 + 点赞/收藏/分享）
- Behind the AI（真实 Agent 抽取样例 + 架构图）

**不包含**：
- 即时聊天 / 找搭子
- 真实用户注册系统（可 mock）
- 自动爬虫
- 二期同款穿搭 / 妆造

### 12.2 排期

| 阶段 | 产出 | 估时 |
|------|------|------|
| 0. 环境搭建 | Next.js + Tailwind + Mapbox + Supabase | 0.5天 |
| 1. 数据准备 | 3团体 × 5–7地点 = 15–20个模板 JSON | 1天 |
| 2. Agent 样例 | 攻略文本 → 模板真实样例（Anthropic API） | 1天 |
| 3. 首页 + 地图 | P-01 + P-02 + 地点卡片 | 1.5天 |
| 4. 模板详情 | P-03 | 0.5天 |
| 5. 云同款生成 | P-04（接 Replicate，1-2真实 + mock） | 1.5天 |
| 6. 路线规划 | P-05（选点 + 排序 + 地图连线） | 1天 |
| 7. 同款广场 | P-06（种子内容 + 互动） | 1天 |
| 8. Behind the AI | P-07 | 0.5天 |
| 9. 打磨 + 测试 | 响应式、边缘情况、性能 | 1天 |

**总计**：快速版 8–9天 / 完整打磨版 2周

### 12.3 时间紧时的优先级

```
首页 → 地图+模板卡 → 云同款生成 → 同款广场
  → 选点路线 → Agent 样例 → Behind the AI
  → App 原型（Figma）→ 文案/分享卡
```

---

## 附录：示例 Seed 数据（BTS / BLACKPINK / aespa）

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
    "review_status": "approved",
    "created_by": "ops"
  },
  {
    "template_id": "tpl_blackpink_jennie_hannam_cafe_001",
    "group_name": "BLACKPINK",
    "idol_name": "Jennie",
    "city": "Seoul",
    "district": "Hannam",
    "place_name_cn": "汉南洞精品咖啡馆",
    "place_name_kr": "한남동 카페",
    "place_name_en": "Hannam Boutique Cafe",
    "place_type": "cafe_restaurant",
    "spot_reason": "Jennie 多次探店同款咖啡馆，充满欧洲小资风格，适合坐窗边拍照",
    "composition_tags": ["half_body", "side_profile", "center"],
    "style_tags": ["warm_light", "cafe_aesthetic", "film_grain"],
    "pose_tags": ["sitting", "looking_away"],
    "photo_tips": "坐在靠窗位置，逆光拍摄，胶片感滤镜加分",
    "risk_notes": "人气很高，建议工作日下午前往",
    "cloud_generation_prompt": "Realistic portrait at a cozy European-style boutique cafe, sitting near window with warm backlight, film grain aesthetic, half body side profile",
    "route_tags": ["gangnam_agency_route", "cafe_hopping", "photo_spot_route"],
    "priority_scores": {
      "idol_relevance_score": 0.80,
      "popularity_score": 0.82,
      "rarity_score": 0.30,
      "photo_quality_score": 0.85,
      "freshness_score": 0.65,
      "confidence_score": 0.78,
      "overall_priority": 0.76
    },
    "review_status": "approved",
    "created_by": "ops"
  },
  {
    "template_id": "tpl_aespa_smtown_coex_001",
    "group_name": "aespa",
    "idol_name": null,
    "city": "Seoul",
    "district": "Gangnam",
    "place_name_cn": "SMTOWN @ COEX 官方商店",
    "place_name_kr": "SMTOWN @ 코엑스아티움",
    "place_name_en": "SMTOWN @ COEX Artium",
    "place_type": "merch_store",
    "spot_reason": "SM 官方周边旗舰店，aespa 专区陈列完整，店内大屏和装置适合打卡",
    "composition_tags": ["full_body", "front_facing", "center"],
    "style_tags": ["cool_tone", "minimal", "street_snap"],
    "pose_tags": ["standing", "looking_away"],
    "photo_tips": "站在 aespa 大幅海报或装置前，广角拍全身，冷色调处理",
    "risk_notes": "周末人多，海报展陈定期更换，出发前确认",
    "cloud_generation_prompt": "Full body portrait inside a modern K-pop merchandise store with large screens and installations, cool tone lighting, minimalist aesthetic, person standing in front of merchandise display",
    "route_tags": ["gangnam_agency_route", "short_distance"],
    "priority_scores": {
      "idol_relevance_score": 0.90,
      "popularity_score": 0.85,
      "rarity_score": 0.20,
      "photo_quality_score": 0.75,
      "freshness_score": 0.80,
      "confidence_score": 0.95,
      "overall_priority": 0.82
    },
    "review_status": "approved",
    "created_by": "ops"
  }
]
```

---

*设计文档 v1.0 · K-Star Spot · 基于 PRD v0.4*
