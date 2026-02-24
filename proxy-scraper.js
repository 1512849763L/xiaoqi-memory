#!/usr/bin/env node

/**
 * proxy-scdn.io 爬虫
 * 动态代理池数据源
 */

const https = require('https');

const API_BASE = 'https://proxy.scdn.io/api/get_proxy.php';
const PROTOCOLS = ['http', 'https', 'socks4', 'socks5'];

/**
 * 获取代理列表
 * @param {string} protocol - http/https/socks4/socks5
 * @param {number} count - 数量
 */
async function fetchProxies(protocol = 'http', count = 100) {
  return new Promise((resolve, reject) => {
    const url = `${API_BASE}?protocol=${protocol}&count=${count}`;

    https.get(url, (res) => {
      let data = '';

      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.code === 200) {
            resolve(json.data.proxies.map(ip => ({
              ip: ip.split(':')[0],
              port: ip.split(':')[1],
              protocol: protocol,
              full: ip
            })));
          } else {
            reject(new Error(json.message));
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

/**
 * 获取所有协议的代理
 */
async function fetchAllProxies(countPerType = 100) {
  const allProxies = [];

  for (const protocol of PROTOCOLS) {
    try {
      console.log(`正在获取 ${protocol.toUpperCase()} 代理...`);
      const proxies = await fetchProxies(protocol, countPerType);
      console.log(`  ✓ 获取到 ${proxies.length} 个 ${protocol.toUpperCase()} 代理`);
      allProxies.push(...proxies);

      // 避免请求过快
      await sleep(1000);
    } catch (e) {
      console.error(`  ✗ ${protocol.toUpperCase()} 获取失败:`, e.message);
    }
  }

  return allProxies;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 导出为不同格式
 */
function exportAsTxt(proxies, filename) {
  const fs = require('fs');
  const lines = proxies.map(p => p.full).join('\n');
  fs.writeFileSync(filename, lines);
  console.log(`\n✓ 已导出到 ${filename} (${proxies.length} 个)`);
}

function exportAsJson(proxies, filename) {
  const fs = require('fs');
  fs.writeFileSync(filename, JSON.stringify(proxies, null, 2));
  console.log(`✓ 已导出到 ${filename}`);
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const count = parseInt(args[0]) || 100;
  const type = args[1] || 'all';

  (async () => {
    console.log(`开始爬取 proxy.scdn.io...\n`);

    let proxies;
    if (type === 'all') {
      proxies = await fetchAllProxies(count);
    } else {
      proxies = await fetchProxies(type, count);
    }

    console.log(`\n总计获取: ${proxies.length} 个代理\n`);

    // 保存
    exportAsTxt(proxies, 'proxies.txt');
    exportAsJson(proxies, 'proxies.json');

    // 统计
    const stats = {};
    proxies.forEach(p => {
      stats[p.protocol] = (stats[p.protocol] || 0) + 1;
    });

    console.log('\n协议分布:');
    Object.entries(stats).forEach(([proto, num]) => {
      console.log(`  ${proto.toUpperCase()}: ${num}`);
    });
  })().catch(console.error);
}

module.exports = { fetchProxies, fetchAllProxies };
