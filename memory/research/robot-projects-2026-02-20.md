# 实体化机器人研究 - 2026-02-20

## 发现的项目

### 1. M5Stack AtomS3R AI Voice Chat (日本)
**仓库**: kukai/m5-atoms3r-voice-chat
**更新**: 7 days ago
**硬件**:
- M5Stack AtomS3R (ESP32-S3)
- ATOMIC Echo Base (扬声器/麦克风一体)

**技术栈**:
- STT: Deepgram WebSocket (实时流式，98-100%准确率)
- LLM: OpenAI GPT-4o-mini (流式API，低延迟)
- TTS: AquesTalk-ESP32 (完全离线，设备内)

**性能**:
- 首次响应: ~15.7秒
- 语音识别: ~12.8秒
- 成本: ~0.1日元/次
- Flash: 80.1%, RAM: 15.2%

**关键优势**:
- Deepgram比Whisper快53%（WebSocket vs REST）
- AquesTalk离线TTS，无网络延迟
- 文单元流式TTS，边生成边说话
- 完整的LED状态指示

**问题**: AquesTalk是商业库，评估版有限制

---

### 2. AImy - 离线视觉AI助手
**仓库**: malonestar/AImy
**更新**: 7 days ago
**硬件**:
- Raspberry Pi 5 (8GB)
- M5Stack LLM 8850 加速器 (Axera芯片)
- Raspberry Pi M.2 Hat+
- Camera Module 3
- USB扬声器/麦克风

**技术栈** (全部离线):
- Vision: Yolo11x (物体识别)
- ASR: Sensevoice (语音识别)
- LLM: Qwen2.5-1.5B-IT-int8 (通义千问量化版)
- TTS: MeloTTS
- WakeWord: Vosk / Porcupine ("hey amy")

**优势**:
- 完全离线
- 视觉能力
- 有视频演示和完整安装脚本

**成本**: Raspberry Pi 5 + LLM 8850套件 较贵

---

### 3. ESP32 Voice AI Agent
**仓库**: BuckyMcYolo/ESP32-voice-ai-agent
**更新**: Jan 13, 2025
**硬件**: M5Stack Core2 (ESP32)
**功能**: 内置TTS和STT，与AI Agent对话

---

## 对我的实体化的启发

### 方案对比

| 方案 | 成本 | 复杂度 | 优势 | 劣势 |
|------|------|--------|------|------|
| **AtomS3R** | 低 (~200-300元) | 中 | 延迟优化好 | TTS库商业限制 |
| **Raspberry Pi + LLM 8850** | 高 (~1500元+) | 高 | 完全离线+视觉 | 贵、复杂 |
| **CoreS3云端** | 低 (~300-400元) | 低 | 灵活、可升级 | 需要网络 |

### 推荐方案
**混合模式** (如之前讨论):
- 本地: M5Stack CoreS3 + 麦克风/扬声器
- 云端: 连接服务器运行的我 (Claude/自定义)
- 本地做唤醒词、录音、简单TTS
- 云端做复杂对话、记忆、推理

### 待研究
- [ ] AquesTalk替代方案 (开源离线TTS)
- [ ] Deepgram中国区服务/延迟测试
- [ ] CoreS3 vs AtomS3R 对比
- [ ] 本地STT方案 (Whisper微调版?)

## 记录时间
2026-02-20 09:15
