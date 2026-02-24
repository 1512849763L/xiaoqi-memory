# 动态代理转售项目 - 技术架构

## 模式
用户请求 → 你的中转服务器 → 随机公共代理 → 目标网站
每次请求自动切换IP

## 技术栈

### 后端
- **Node.js + Express** 或 **Go + Gin**（高性能）
- **async/await** 异步处理
- **连接池**：管理后端代理连接

### 核心模块

#### 1. 代理池管理
```javascript
class ProxyPool {
  constructor() {
    this.proxies = [];  // [{ip, port, protocol, speed, last_check, alive}]
    this.currentIndex = 0;
  }

  // 获取下一个可用代理
  getNext() {
    // 轮询或随机
    return this.proxies[this.currentIndex++ % this.proxies.length];
  }

  // 移除失效代理
  remove(proxy) {
    this.proxies = this.proxies.filter(p => p !== proxy);
  }

  // 批量添加
  add(proxies) {
    this.proxies.push(...proxies);
  }
}
```

#### 2. 请求转发
```javascript
app.use('/fetch', async (req, res) => {
  const { url } = req.query;
  const maxRetries = 3;

  for (let i = 0; i < maxRetries; i++) {
    const proxy = proxyPool.getNext();

    try {
      const response = await fetch(url, {
        proxy: `${proxy.protocol}://${proxy.ip}:${proxy.port}`,
        timeout: 5000
      });

      return res.send(response.data);
    } catch (error) {
      // 代理失败，移除并重试
      proxyPool.remove(proxy);
      continue;
    }
  }

  // 所有代理都失败
  res.status(500).send('No working proxy available');
});
```

#### 3. 持续验证
```javascript
// 每5分钟验证所有代理
setInterval(async () => {
  for (const proxy of proxyPool.proxies) {
    const alive = await testProxy(proxy);
    if (!alive) {
      proxyPool.remove(proxy);
    }
  }
}, 5 * 60 * 1000);
```

#### 4. 爬虫持续补充
```javascript
// 每小时爬取新代理
cron.schedule('0 * * * *', async () => {
  const newProxies = await crawlProxies();
  const validProxies = await validateProxies(newProxies);
  proxyPool.add(validProxies);
});
```

## API设计

### 用户端（极简）
```bash
# 用户只需要配置这个
curl -x your-proxy.com:8080 \
     -U api_key:xxx \
     https://example.com
```

### 管理端
```bash
# 获取统计
GET /api/stats
→ { total_proxies: 1234, alive: 856, avg_speed: 1.2s }

# 手动刷新代理池
POST /api/refresh
```

## 计费模式

### 方案 A：按请求次数
- $0.01/请求
- 适合：低频用户

### 方案 B：包月不限量
- $10/月，无限请求
- 适合：高频用户（但需要限速，避免滥用）

### 方案 C：混合
- 免费层：100请求/天
- 基础版：$5/月，1000请求/天
- 专业版：$20/月，无限请求

## 成本
- 服务器：$10-20/月（需要更高配置）
- 带宽：可能额外收费（如果流量大）

## 收入预测
- 日均 20 个付费用户（动态代理需求更大）
- 人均 $10/月
- 月收入：$200
- 净利润：~$150-180

## 关键挑战
1. **代理质量** — 需要至少 500-1000 个可用代理
2. **速度** — 公共代理慢，需要超时控制
3. **稳定性** — 自动重试 + 故障转移
4. **并发** — 多用户同时请求时的性能

## 下一步
1. 测试 proxy.scdn.io 的爬取难度
2. 搭建代理池原型
3. 测试转发功能
4. 压力测试（看看能撑多少并发）
