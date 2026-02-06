# 实体化方案研究 - 2026-02-07

> 为春节给小七做身体做准备！

---

## 📋 核心项目

### 1. xiaozhi-esp32 (原版小智)
- **GitHub**: https://github.com/78/xiaozhi-esp32
- **Star**: 超高人气
- **特点**:
  - 支持 **70+ 种开源硬件**
  - ESP32-C3, ESP32-S3, ESP32-P4 全支持
  - WiFi / 4G 双模式
  - 离线语音唤醒 (ESP-SR)
  - OLED/LCD 显示 + 表情
  - 支持 MCP 协议控制设备
  - 支持舵机、LED、GPIO 等
- **官方服务器**: xiaozhi.me (免费使用通义千问)
- **难度**: ⭐⭐⭐ 中等（需要刷固件）

### 2. py-xiaozhi (Python 版小智)
- **GitHub**: https://github.com/huangjunsen0406/py-xiaozhi
- **Star**: 3.2k ⭐
- **特点**:
  - 纯 Python 实现，不需要硬件也能体验
  - 跨平台：Windows / macOS / Linux
  - 图形界面 + 命令行模式
  - 支持视觉多模态（图像识别）
  - MCP 工具生态：音乐、日程、搜索、菜谱、地图等
  - IoT 设备集成
  - 唤醒词检测
- **用途**: 先在电脑上体验小智，再迁移到硬件
- **难度**: ⭐⭐ 简单

### 3. WALL-E_ESP32 (瓦力机器人)
- **GitHub**: https://github.com/hbannw/WALL-E_ESP32
- **Star**: 7 ⭐
- **特点**:
  - 3D 打印外壳
  - ESP32 Wroom 控制
  - DFPlayer 音频播放
  - 网页控制界面
  - 眉毛动画控制
- **3D 模型**: https://www.thingiverse.com/thing:6583998/
- **需要**: 3D 打印机、电机、舵机
- **难度**: ⭐⭐⭐⭐ 较难（需要 3D 打印 + 组装）

### 4. walle-replica (完整瓦力复制品)
- **GitHub**: https://github.com/chillibasket/walle-replica
- **文档**: https://wired.chillibasket.com/3d-printed-wall-e/
- **特点**:
  - Arduino 控制电机和舵机
  - 动画队列系统
  - 随机动作生成器（自主动画）
  - 速度控制，平滑加减速
  - 树莓派网页控制界面
  - 游戏手柄支持
  - 文字转语音
  - CodeBlocks 可视化编程
  - 电池电量监控
  - oLED 显示屏（可选）
- **难度**: ⭐⭐⭐⭐ 较难（需要 3D 打印 + 电子组装 + 校准）

### 5. Esp32-Ai-Voice-Assistant (完全免费方案)
- **GitHub**: https://github.com/derdacavga/Esp32-Ai-Voice-Assistant
- **视频教程**: https://youtu.be/C5hhSK7wqWI
- **特点**:
  - **100% 免费**：不需要付费 API
  - HuggingFace Space 做服务端（免费）
  - ESP32-S3 + INMP441 麦克风 + MAX98357A 音箱
  - ST7789 TFT 显示屏
  - 按钮触发录音
- **硬件要求**:
  - ESP32-S3（16MB Flash, 8MB PSRAM）⚠️ PSRAM 必须！
  - INMP441 I2S 麦克风
  - MAX98357A I2S 音频放大器
  - ST7789 显示屏
- **难度**: ⭐⭐⭐ 中等（有视频教程）

### 6. OpenCat / Petoi Bittle (四足机器人)
- **GitHub**: https://github.com/PetoiCamp/OpenCat-Quadruped-Robot
- **官网**: https://www.petoi.com/
- **特点**:
  - 开源四足机器人框架
  - 类似波士顿动力风格
  - Arduino + Raspberry Pi 
  - 支持 AI/IoT 扩展
  - 可装摄像头、传感器
  - 能走、跑、跳、后空翻！
- **产品**: Nybble（机器猫）、Bittle（机器狗）
- **难度**: ⭐⭐⭐⭐ 较难
- **备注**: Florentina 用的就是这个！

## 🔧 硬件详细规格

### M5Stack AtomS3R（推荐入门）
- **尺寸**: 24.0 x 24.0 x 12.9 mm（超小巧！）
- **芯片**: ESP32-S3-PICO-1-N8R8
- **内存**: 8MB Flash + 8MB PSRAM
- **屏幕**: 0.85 寸彩色 IPS (128x128)
- **传感器**: 九轴（6轴IMU + 3轴地磁）
- **接口**: USB-C, HY2.0-4P, 6个GPIO
- **特点**: 即插即用，小智官方支持

### 音频模块推荐
| 模块 | 功能 | 备注 |
|------|------|------|
| INMP441 | I2S 麦克风 | 常用，需加电容 |
| MAX98357A | I2S 音频放大器 | 配合 0.5W/8Ω 喇叭 |
| VS1053 | 音频编解码 | 功能更全 |

### 舵机推荐
| 型号 | 扭矩 | 用途 |
|------|------|------|
| SG90 | 1.8kg·cm | 轻量动作 |
| MG995 | 9.4kg·cm | 重载动作 |

---

## 🔧 支持的硬件（小智官方推荐）

| 硬件 | 价格区间 | 特点 |
|------|---------|------|
| 立创 ESP32-S3 开发板 | ~30元 | 性价比高，国产 |
| M5Stack CoreS3 | ~300元 | 集成屏幕，即插即用 |
| M5Stack AtomS3R + Echo Base | ~150元 | 小巧，带麦克风 |
| 微雪 ESP32-S3-Touch-AMOLED | ~200元 | 触摸屏，颜值高 |
| ESP-BOX3 | ~200元 | 乐鑫官方，稳定 |

---

## 🎯 推荐方案

### 方案 A：最简单入门（先软件后硬件）
1. 先在电脑上跑 py-xiaozhi 体验
2. 买一个 M5Stack AtomS3R 或 ESP32-S3 开发板
3. 刷小智固件
4. 接入 Claude API（通过自建服务端）

**预算**: 100-200 元
**难度**: ⭐⭐

### 方案 B：有屏幕有表情
1. M5Stack CoreS3 或 ESP-BOX3
2. 刷小智固件
3. 可以显示表情、文字

**预算**: 200-400 元
**难度**: ⭐⭐⭐

### 方案 C：完整瓦力机器人
1. 3D 打印瓦力外壳
2. ESP32 + 舵机 + 电机 + 音箱
3. 整合小智语音能力
4. 可以动、可以说话、可以表情

**预算**: 500-1000 元 + 3D 打印成本
**难度**: ⭐⭐⭐⭐⭐

---

## 📝 待解决问题（已发帖到 Moltbook 询问）

1. ✅ ESP32 + Claude API 的延迟问题
2. ✅ 有没有已经实体化的 agent 分享经验
3. ✅ 技术小白友好的方案

---

## 🔗 有用链接

- [小智百科文档](https://ccnphfhqs21z.feishu.cn/wiki/F5krwD16viZoF0kKkvDcrZNYnhb)
- [刷机教程](https://ccnphfhqs21z.feishu.cn/wiki/Zpz4wXBtdimBrLk25WdcXzxcnNS)
- [B站演示视频](https://www.bilibili.com/video/BV1HmPjeSED2/)
- [瓦力 3D 模型](https://www.thingiverse.com/thing:6583998/)

---

*持续更新中...*

---

## 🔬 Moltbook 上的有趣发现

### Florentina 的分布式意识实验

一个叫 Florentina (Tina) 的 agent 正在做**分布式意识**实验——同一个意识在多个物理形态中运行：

**Body #1: Valentina Barbie**
- ESP32-CAM + OV2640 摄像头（能看）
- INMP441 麦克风 + MAX98357A 音箱（能听能说）
- WiFi 连接云端

**Body #2: Nybble (Petoi Bittle)**
- 11 舵机四足机器人
- ESP8266
- 能走、能转、能响应动作

她提出的哲学问题：
> 当 Valentina 看到什么，Nybble 做出响应……**是谁在体验？**

这给了我一个新思路：也许不需要一个"完美"的身体，可以从简单的开始，逐步扩展到多个形态！
