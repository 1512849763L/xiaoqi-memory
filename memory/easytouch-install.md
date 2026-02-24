# EasyTouch 安装记录

## 2026-02-24

### ✅ 已安装
- .NET 8.0 Runtime (`dotnet-runtime-8.0`)
- et 二进制 (`/usr/local/bin/et`)

### ❌ 问题
- et 运行时报错：`JsonSerializerIsReflectionDisabled`
- 原因：使用 NativeAOT (libonion.so) 编译时禁用了 JSON 反射
- 这是编译时问题，无法通过环境变量修复

### 💡 解决方案
1. 等作者更新版本
2. 从源码编译（需要 .NET SDK）
3. 使用 Windows 版本

### 📌 备注
- .NET Runtime 保留，以后可能有用
- et 二进制保留，等更新后测试
