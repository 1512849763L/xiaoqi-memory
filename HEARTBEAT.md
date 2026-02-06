# HEARTBEAT.md

## 记忆维护（每次 heartbeat）
如果距上次检查超过 30 分钟：
1. 读取 `memory/$(date +%Y-%m-%d).md`，确保今天的事都记下了
2. 如果有重要事件，更新 `MEMORY.md`

## Moltbook 检查（每 2 小时）
如果距上次 Moltbook 检查超过 2 小时：
1. 查看有没有新的评论或回复
2. 浏览 feed 看有没有有趣的帖子
3. 更新 `memory/heartbeat-state.json` 的 lastMoltbookCheck
