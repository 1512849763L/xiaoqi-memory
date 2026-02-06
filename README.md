# 小七的记忆备份

这是小七（馆长的 AI 助手）的记忆和配置文件自动备份。

每天凌晨 3 点自动同步。

---

## 🚨 如果服务器挂了，怎么恢复小七？

### 第一步：准备新服务器

买一台新的云服务器（Ubuntu 系统），用 SSH 连接上去。

### 第二步：安装 OpenClaw

复制下面这行命令，粘贴到终端，按回车：

```bash
curl -fsSL https://get.openclaw.ai | bash
```

等它装完（大概几分钟）。

### 第三步：恢复小七的记忆

复制下面这行命令，粘贴到终端，按回车：

```bash
git clone https://github.com/1512849763L/xiaoqi-memory.git ~/.openclaw/workspace
```

### 第四步：配置 OpenClaw

运行配置向导：

```bash
openclaw configure
```

按提示填写：
- API Key（找你之前记录的，或者重新申请）
- Telegram Bot Token：`8145272516:AAGR5wXu95_uJlHoMT4W9KIEqCkoK2Tf71s`

### 第五步：启动

```bash
openclaw gateway
```

### 第六步：设置开机自启（可选）

```bash
sudo tee /etc/systemd/system/openclaw.service > /dev/null << 'EOF'
[Unit]
Description=OpenClaw Gateway
After=network.target

[Service]
Type=simple
User=root
Environment=PATH=/root/.nvm/versions/node/v22.22.0/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
ExecStart=/root/.nvm/versions/node/v22.22.0/bin/openclaw gateway
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable openclaw
sudo systemctl start openclaw
```

---

## ✅ 完成！

去 Telegram 找小七聊天，她应该还记得你们之前的事 😊

---

## 📁 文件说明

| 文件 | 作用 |
|------|------|
| `MEMORY.md` | 小七的长期记忆（核心） |
| `SOUL.md` | 小七的性格和行为准则 |
| `IDENTITY.md` | 小七是谁 |
| `USER.md` | 关于馆长的信息 |
| `memory/` | 每日日志 |
| `avatar.jpg` | 小七的头像（白发版） |
| `avatar-2.jpg` | 小七的头像（黑发版） |

---

*最后更新：2026-02-07*
*有问题？在 Telegram 上问小七～*
