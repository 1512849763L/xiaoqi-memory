# AdLink 短链广告联盟 - 需求文档 v1.0

## 一、平台概述

### 1.1 商业模式
**自有广告源 CPM 短链平台**
- 上游：自有广告来源（非第三方广告联盟）
- 下游：用户分享短链赚取分成

### 1.2 核心流程
```
广告商 → 管理员复制广告 → 平台链接池 → 用户获取链接 → 用户分享 → 访客浏览 → 追踪统计 → 分发奖励
```

### 1.3 技术栈
- **框架**：Next.js 14+ (App Router)
- **UI**：Tailwind CSS + shadcn/ui
- **数据库**：PostgreSQL + Redis
- **ORM**：Prisma
- **语言**：TypeScript（全英文注释）

---

## 二、系统架构

### 2.1 路由设计
```
/app
├── /(public)                    # 公开页面（英文）
│   ├── /                        # 落地页
│   ├── /login                   # 用户登录
│   ├── /register                # 用户注册
│   └── /[slug]                  # 短链中间页
│
├── /(user)                      # 用户端（英文，需登录）
│   ├── /dashboard               # 仪表盘
│   ├── /links                   # 我的链接
│   ├── /stats                   # 统计数据
│   ├── /earnings                # 收益明细
│   ├── /withdraw                # 提现
│   ├── /messages                # 站内信
│   └── /settings                # 账户设置
│
├── /(admin)                     # 管理端（登录英文，内部中文）
│   └── /info/ccs001             # 安全入口
│       ├── /login               # 管理员登录（英文）
│       ├── /dashboard           # 管理仪表盘（中文）
│       ├── /ad-pool             # 广告链接池管理
│       ├── /users               # 用户管理
│       ├── /links               # 全部链接
│       ├── /stats               # 全局统计
│       ├── /finance             # 财务管理/提现审核
│       ├── /messages            # 站内信管理
│       ├── /risk                # 风控系统
│       ├── /payments            # 支付方式配置
│       └── /settings            # 系统设置
```

### 2.2 安全入口
- 管理端入口路径：`/info/ccs001/login`
- 路径在环境变量中配置，可随时更换

---

## 三、核心功能模块

### 3.1 用户系统

**注册/登录**
- [x] 邮箱 + 密码注册
- [x] 邮箱验证
- [ ] Google OAuth（预留，待域名就绪）
- [x] 忘记密码/重置密码

**用户信息**
- 邮箱、昵称、头像
- 注册时间、IP、地区
- 账户状态（正常/冻结/封禁）

### 3.2 广告链接池（管理端）

**管理员操作**
- 添加上游广告链接
- 设置链接分类/标签
- 设置单链接 CPM 基准价
- 设置链接状态（启用/停用）
- 链接库存/配额管理

**链接分配**
- 用户从池中获取链接
- 自动生成用户专属短链
- 追踪链接归属

### 3.3 短链系统

**用户操作**
- 从链接池获取可分享链接
- 查看我的链接列表
- 查看单链接统计

**中间页**
- 倒计时（可配置秒数）
- 展示广告内容
- 人机验证（可选）
- 跳转按钮

### 3.4 统计系统

**数据采集**
- 访问 IP / 地区 / 设备 / UA / Referer
- 访问时间
- 是否完成跳转
- 指纹信息

**数据展示（用户端）**
- 访问量（应用统计比例后的数值）
- CPM 单价（2小时滚动平均）
- 预估收益

**数据展示（管理端）**
- 真实访问量
- 用户看到的访问量
- 流量质量评分

**更新机制**
- 仪表盘数据：每 **2 小时** 更新
- CPM：该链接创建后每 **2 小时** 的平均值
- 用户余额：每天 **UTC 00:00** 结算（审计后）

### 3.5 统计比例配置

**管理端配置**
- 全局默认比例：**40%**（后台可随时调整）
- 按地区设置比例
- 按用户等级设置比例
- 按链接设置比例（覆盖全局）

**计算逻辑**
```
用户看到的访问量 = 真实访问量 × 统计比例
用户收益 = 用户看到的访问量 ÷ 1000 × CPM
```

### 3.6 收益与提现

**余额机制**
- 实时累计（用户不可见）
- 每日 UTC 00:00 结算到可用余额
- 审计期（后台可配置天数）

**提现**
- 最低提现额度（后台可配）
- 支付方式（后台配置，支持多种）
- 提现申请 → 管理员审核 → 打款

### 3.7 站内信

**功能**
- 系统通知（全员/分组）
- 个人消息
- 已读/未读状态
- 消息模板（管理端配置）

### 3.8 支付方式配置（管理端）

**高自定义**
- 支付方式名称
- 图标
- 所需字段（如 PayPal 邮箱、USDT 地址）
- 启用/停用
- 排序

---

## 四、风控系统（全量规则）

### 4.1 IP 维度
| 规则 | 说明 | 默认阈值 |
|------|------|----------|
| 同 IP 频率限制 | 同一 IP 单位时间内访问次数上限 | 10次/分钟 |
| 同 IP 日上限 | 同一 IP 每日访问次数上限 | 100次/天 |
| IP 黑名单 | 手动/自动加入的封禁 IP | - |
| 代理/VPN 检测 | 检测并标记代理流量 | 标记，不计费 |
| 数据中心 IP 检测 | 识别机房 IP | 标记，不计费 |
| IP 地区限制 | 限制/允许特定国家地区 | 可配置白名单/黑名单 |

### 4.2 设备/指纹维度
| 规则 | 说明 | 默认阈值 |
|------|------|----------|
| 同指纹频率限制 | 同一浏览器指纹访问频率 | 5次/小时 |
| 同指纹日上限 | 同一指纹每日上限 | 20次/天 |
| 指纹黑名单 | 封禁特定指纹 | - |
| 无头浏览器检测 | 检测 Puppeteer/Playwright | 标记，不计费 |
| Canvas 指纹异常 | 指纹信息不一致 | 标记 |
| WebGL 指纹异常 | 渲染器信息异常 | 标记 |

### 4.3 行为维度
| 规则 | 说明 | 默认阈值 |
|------|------|----------|
| 访问速度异常 | 页面停留时间过短 | <2秒不计费 |
| 鼠标/触摸轨迹 | 无人类交互行为 | 标记 |
| 跳出率异常 | 未完成跳转直接关闭 | 不计费 |
| 重复访问模式 | 规律性访问（机器人特征） | 标记 |
| Referer 异常 | 来源不合理 | 标记 |

### 4.4 用户维度
| 规则 | 说明 | 默认阈值 |
|------|------|----------|
| 新用户观察期 | 新注册用户流量单独审计 | 7天 |
| 流量质量评分 | 综合评分低于阈值 | <30分冻结 |
| 异常流量占比 | 无效流量超过比例 | >70% 警告 |
| 自点击检测 | 用户 IP 与访客 IP 重合 | 不计费 |
| 关联账户检测 | 多账户同 IP/指纹 | 标记审核 |

### 4.5 全局维度
| 规则 | 说明 | 默认阈值 |
|------|------|----------|
| 全局并发限制 | 系统每秒最大请求数 | 可配置 |
| 单链接热度限制 | 单链接每分钟访问上限 | 1000次/分钟 |
| 异常流量告警 | 流量突增自动告警 | >300% 告警 |

### 4.6 风控动作
| 动作 | 说明 |
|------|------|
| 正常计费 | 通过所有规则 |
| 标记 | 记录但仍计费（供人工审核） |
| 不计费 | 记录但不计入用户收益 |
| 警告 | 触发阈值，发送站内信警告 |
| 冻结 | 暂停账户，待人工审核 |
| 封禁 | 永久封禁账户 |

### 4.7 风控日志
- 所有命中规则的访问记录
- 支持按规则/用户/链接筛选
- 导出功能

---

## 五、多语言策略

| 区域 | 语言 |
|------|------|
| 用户端全部页面 | 英文 |
| 管理端登录页 | 英文 |
| 管理端内部 | 中文 |
| 代码注释 | 英文 |
| Git Commit | 英文 |

---

## 六、配套工具

### 6.1 压测/反作弊测试脚本

**功能**
- 动态代理 IP 池调用
- 随机 UA 生成
- 指纹浏览器模拟（Canvas/WebGL/屏幕分辨率等）
- 多并发访问测试
- 模拟人类行为（鼠标移动、停留时间）
- 生成测试报告

**访问控制**
- 卡密验证接口（预留字段）
- 内部工具，不对外

**技术实现**
- Python + Playwright
- 配置文件驱动
- CLI 运行 + 日志输出

---

## 七、数据库设计

```sql
-- 用户表
users
├── id                 UUID PRIMARY KEY
├── email              VARCHAR UNIQUE
├── password_hash      VARCHAR
├── nickname           VARCHAR
├── avatar             VARCHAR
├── role               ENUM('user', 'admin')
├── status             ENUM('active', 'frozen', 'banned')
├── balance            DECIMAL(10,4)      -- 可用余额
├── pending_balance    DECIMAL(10,4)      -- 待结算余额
├── quality_score      INT                -- 流量质量评分
├── registered_ip      VARCHAR
├── registered_country VARCHAR
├── created_at         TIMESTAMP
└── updated_at         TIMESTAMP

-- 广告链接池
ad_pool
├── id                 UUID PRIMARY KEY
├── original_url       TEXT               -- 上游广告链接
├── title              VARCHAR
├── description        TEXT
├── category           VARCHAR
├── tags               VARCHAR[]
├── base_cpm           DECIMAL(6,4)       -- 基准 CPM
├── status             ENUM('active', 'inactive')
├── created_at         TIMESTAMP
└── updated_at         TIMESTAMP

-- 用户短链
links
├── id                 UUID PRIMARY KEY
├── user_id            UUID REFERENCES users
├── ad_pool_id         UUID REFERENCES ad_pool
├── slug               VARCHAR UNIQUE     -- 短链后缀
├── custom_ratio       DECIMAL(3,2)       -- 自定义统计比例（覆盖全局）
├── status             ENUM('active', 'paused')
├── created_at         TIMESTAMP
└── updated_at         TIMESTAMP

-- 访问记录
visits
├── id                 UUID PRIMARY KEY
├── link_id            UUID REFERENCES links
├── ip                 VARCHAR
├── country            VARCHAR
├── region             VARCHAR
├── city               VARCHAR
├── device_type        VARCHAR            -- desktop/mobile/tablet
├── os                 VARCHAR
├── browser            VARCHAR
├── ua                 TEXT
├── fingerprint        VARCHAR
├── referer            TEXT
├── is_proxy           BOOLEAN
├── is_datacenter      BOOLEAN
├── is_headless        BOOLEAN
├── stay_duration_ms   INT                -- 页面停留时间
├── has_interaction    BOOLEAN            -- 是否有鼠标/触摸
├── completed_redirect BOOLEAN            -- 是否完成跳转
├── is_valid           BOOLEAN            -- 风控判定是否有效
├── invalid_reason     VARCHAR            -- 无效原因
├── risk_flags         VARCHAR[]          -- 命中的风控规则
├── created_at         TIMESTAMP

-- 2小时统计聚合
stats_hourly
├── id                 UUID PRIMARY KEY
├── link_id            UUID REFERENCES links
├── period_start       TIMESTAMP
├── period_end         TIMESTAMP
├── real_visits        INT                -- 真实访问量
├── valid_visits       INT                -- 有效访问量
├── shown_visits       INT                -- 展示给用户的访问量
├── cpm                DECIMAL(6,4)       -- 该时段 CPM
├── earnings           DECIMAL(10,4)      -- 该时段收益
└── created_at         TIMESTAMP

-- 每日结算记录
daily_settlements
├── id                 UUID PRIMARY KEY
├── user_id            UUID REFERENCES users
├── date               DATE
├── total_real_visits  INT
├── total_valid_visits INT
├── total_shown_visits INT
├── total_earnings     DECIMAL(10,4)
├── status             ENUM('pending', 'audited', 'settled')
├── audited_at         TIMESTAMP
├── settled_at         TIMESTAMP
└── created_at         TIMESTAMP

-- 提现记录
withdrawals
├── id                 UUID PRIMARY KEY
├── user_id            UUID REFERENCES users
├── amount             DECIMAL(10,4)
├── fee                DECIMAL(10,4)      -- 手续费
├── net_amount         DECIMAL(10,4)      -- 实际到账
├── payment_method_id  UUID REFERENCES payment_methods
├── payment_info       JSONB              -- 收款信息
├── status             ENUM('pending', 'approved', 'rejected', 'processing', 'completed', 'failed')
├── reject_reason      TEXT
├── processed_at       TIMESTAMP
├── completed_at       TIMESTAMP
├── created_at         TIMESTAMP
└── updated_at         TIMESTAMP

-- 站内信
messages
├── id                 UUID PRIMARY KEY
├── user_id            UUID REFERENCES users  -- null = 全员广播
├── title              VARCHAR
├── content            TEXT
├── type               ENUM('system', 'personal', 'warning')
├── is_read            BOOLEAN DEFAULT FALSE
├── created_at         TIMESTAMP

-- 支付方式配置
payment_methods
├── id                 UUID PRIMARY KEY
├── name               VARCHAR            -- 如 "PayPal", "USDT-TRC20"
├── icon               VARCHAR            -- 图标 URL
├── fields             JSONB              -- 所需字段定义
├── min_amount         DECIMAL(10,4)      -- 最低提现
├── max_amount         DECIMAL(10,4)      -- 单次上限
├── fee_type           ENUM('fixed', 'percent')
├── fee_value          DECIMAL(10,4)
├── enabled            BOOLEAN
├── sort_order         INT
├── created_at         TIMESTAMP
└── updated_at         TIMESTAMP

-- 系统配置
settings
├── key                VARCHAR PRIMARY KEY
├── value              JSONB
├── description        VARCHAR
└── updated_at         TIMESTAMP

-- 风控规则配置
risk_rules
├── id                 UUID PRIMARY KEY
├── name               VARCHAR            -- 规则名称
├── category           VARCHAR            -- ip/device/behavior/user/global
├── condition          JSONB              -- 触发条件
├── action             ENUM('mark', 'no_credit', 'warn', 'freeze', 'ban')
├── enabled            BOOLEAN
├── priority           INT
├── created_at         TIMESTAMP
└── updated_at         TIMESTAMP

-- 风控日志
risk_logs
├── id                 UUID PRIMARY KEY
├── visit_id           UUID REFERENCES visits
├── user_id            UUID REFERENCES users
├── rule_id            UUID REFERENCES risk_rules
├── rule_name          VARCHAR
├── action_taken       VARCHAR
├── details            JSONB
├── created_at         TIMESTAMP

-- IP 黑名单
ip_blacklist
├── id                 UUID PRIMARY KEY
├── ip                 VARCHAR            -- 支持 CIDR
├── reason             TEXT
├── expires_at         TIMESTAMP          -- null = 永久
├── created_at         TIMESTAMP

-- 指纹黑名单
fingerprint_blacklist
├── id                 UUID PRIMARY KEY
├── fingerprint        VARCHAR
├── reason             TEXT
├── expires_at         TIMESTAMP
├── created_at         TIMESTAMP
```

---

## 八、系统配置项（settings 表默认值）

```json
{
  "stat_ratio_default": 0.4,
  "stat_ratio_by_country": {},
  "audit_days": 2,
  "min_withdraw_default": 10,
  "countdown_seconds": 5,
  "captcha_enabled": false,
  "new_user_observation_days": 7,
  "quality_score_freeze_threshold": 30,
  "invalid_traffic_warn_threshold": 0.7
}
```

---

## 九、AI 助手系统（小七专属）

### 9.1 权限体系

| 角色 | 权限等级 | 说明 |
|------|----------|------|
| 馆长 | Level 1 | 最高权限，无限制 |
| 小七 | Level 2 | 系统助手，仅次于馆长 |
| 管理员 | Level 3 | 运营人员，受限操作 |
| 用户 | Level 4 | 普通用户 |

### 9.2 API 接口（小七专用）

**认证方式**
- Bearer Token（长期有效，环境变量配置）
- IP 白名单（仅服务器 IP 可调用）

**接口列表**

```
# 数据查询类
GET  /api/ai/stats/overview          # 全局统计概览
GET  /api/ai/stats/realtime          # 实时数据
GET  /api/ai/stats/trends            # 趋势分析数据
GET  /api/ai/users                   # 用户列表（含质量评分）
GET  /api/ai/users/:id               # 用户详情
GET  /api/ai/users/:id/analysis      # 用户行为分析
GET  /api/ai/links                   # 链接列表
GET  /api/ai/links/:id/analysis      # 单链接流量分析
GET  /api/ai/withdrawals             # 提现列表
GET  /api/ai/risk/alerts             # 风控告警
GET  /api/ai/risk/logs               # 风控日志
GET  /api/ai/finance/summary         # 财务摘要

# 分析类
POST /api/ai/analyze/traffic         # 流量质量分析
POST /api/ai/analyze/user/:id        # 用户风险评估
POST /api/ai/analyze/anomaly         # 异常检测
POST /api/ai/report/daily            # 生成日报数据
POST /api/ai/report/weekly           # 生成周报数据

# 操作类（Level 2 权限）
POST /api/ai/users/:id/warn          # 发送警告站内信
POST /api/ai/users/:id/freeze        # 冻结用户（可解冻）
POST /api/ai/messages/broadcast      # 发送系统公告
PUT  /api/ai/settings/:key           # 修改系统配置
PUT  /api/ai/risk/rules/:id          # 调整风控规则阈值

# 禁止操作（仅 Level 1）
# - 封禁用户（永久）
# - 删除数据
# - 审批提现
# - 修改用户余额
# - 修改 AI 接口配置
```

### 9.3 数据推送（Webhook）

系统主动推送给小七的事件：

| 事件 | 触发条件 | 推送内容 |
|------|----------|----------|
| `risk.alert` | 风控告警触发 | 用户ID、规则、详情 |
| `withdraw.new` | 新提现申请 | 申请详情 |
| `traffic.anomaly` | 流量异常波动 | 波动数据 |
| `user.frozen` | 用户被自动冻结 | 用户信息、原因 |
| `daily.summary` | 每日 UTC 01:00 | 昨日统计摘要 |

**Webhook 配置**
```json
{
  "ai_webhook_url": "https://你的服务器/webhook/adlink",
  "ai_webhook_secret": "xxx",
  "ai_webhook_events": ["risk.alert", "withdraw.new", "traffic.anomaly", "user.frozen", "daily.summary"]
}
```

### 9.4 小七职责

**日常监控**
- 每日查看统计摘要，发现异常主动汇报
- 监控风控告警，分析可疑用户
- 追踪流量趋势，提供运营建议

**辅助分析**
- 用户流量质量评估
- 异常行为模式识别
- 提现申请风险预判（供馆长审批参考）

**自动化操作（需授权）**
- 对高风险用户发送警告
- 临时冻结严重违规账户（馆长随时可解冻）
- 调整风控阈值应对突发情况

**汇报**
- 日报/周报推送
- 重要事件即时通知

---

## 十、域名与多租户配置

### 10.1 域名高度自定义

**环境变量配置**
```env
# 主域名（可随时更换）
PRIMARY_DOMAIN=example.com

# 短链域名（可独立，可与主域名相同）
SHORTLINK_DOMAIN=short.example.com

# API 域名（可选，默认用主域名）
API_DOMAIN=api.example.com

# 管理端入口路径
ADMIN_PATH=info/ccs001

# CDN 域名（静态资源）
CDN_DOMAIN=cdn.example.com
```

### 10.2 域名无关设计原则

| 模块 | 设计要求 |
|------|----------|
| 数据库 | 不存储完整 URL，只存 slug/路径 |
| 短链生成 | 运行时拼接域名，不写死 |
| 邮件模板 | 域名从配置读取 |
| 前端代码 | 使用相对路径或环境变量 |
| OAuth 回调 | 配置项，换域名改配置即可 |
| SSL 证书 | 支持自动申请（Let's Encrypt）或手动配置 |

### 10.3 换域名流程（设计目标）

```
1. 修改环境变量
2. 重启服务
3. 完成
```

**无需**：
- 改代码
- 改数据库
- 重新部署

### 10.4 多域名支持（预留）

```env
# 未来可能需要多个短链域名轮换
SHORTLINK_DOMAINS=a.com,b.com,c.com
SHORTLINK_ROTATION=random  # random | round-robin | weighted
```

### 10.5 数据库存储规范

```sql
-- ✅ 正确：只存 slug
links.slug = "abc123"

-- ❌ 错误：存完整 URL
links.url = "https://example.com/abc123"

-- 运行时生成完整 URL
getFullUrl(slug) => `https://${process.env.SHORTLINK_DOMAIN}/${slug}`
```

---

## 十一、CDN 与容灾架构

### 11.1 CDN 配置

**静态资源 CDN**
```env
# CDN 配置
CDN_ENABLED=true
CDN_DOMAIN=cdn.example.com
CDN_PROVIDER=cloudflare  # cloudflare | cloudfront | bunny | custom

# 缓存策略
CDN_CACHE_STATIC=31536000    # 静态资源 1 年
CDN_CACHE_HTML=0             # HTML 不缓存
CDN_CACHE_API=0              # API 不缓存
```

**CDN 加速范围**
| 资源类型 | CDN | 缓存时间 |
|----------|-----|----------|
| JS/CSS | ✅ | 1 年（带 hash） |
| 图片/字体 | ✅ | 1 年 |
| 中间页 HTML | ❌ | 不缓存（需统计） |
| API 接口 | ❌ | 不缓存 |
| 短链跳转 | ❌ | 不缓存（需统计） |

### 11.2 架构设计（支持弹性扩容）

```
                    ┌─────────────────┐
                    │   Cloudflare    │
                    │   (DNS + CDN)   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Load Balancer  │
                    │  (Nginx/云LB)    │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
   ┌─────▼─────┐       ┌─────▼─────┐       ┌─────▼─────┐
   │  App #1   │       │  App #2   │       │  App #N   │
   │ (Next.js) │       │ (Next.js) │       │ (可动态增加) │
   └─────┬─────┘       └─────┬─────┘       └─────┬─────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
        ┌─────▼─────┐  ┌─────▼─────┐  ┌─────▼─────┐
        │PostgreSQL │  │   Redis   │  │ Redis队列 │
        │ (主从)    │  │  (集群)   │  │ (异步任务) │
        └───────────┘  └───────────┘  └───────────┘
```

### 11.3 弹性扩容设计

**无状态应用层**
- Next.js 应用完全无状态
- Session 存 Redis，不存本地
- 文件上传直传 S3/OSS，不存本地
- 可随时增减服务器

**数据库层**
```env
# PostgreSQL
DATABASE_URL=postgresql://...
DATABASE_POOL_SIZE=20
DATABASE_READ_REPLICAS=replica1.db,replica2.db  # 读写分离

# Redis
REDIS_URL=redis://...
REDIS_CLUSTER=true
REDIS_NODES=node1:6379,node2:6379,node3:6379
```

**队列与异步任务