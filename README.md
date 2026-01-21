# 循翼 Aerotrace

> 🚀 基于 **Next.js 14 + TypeScript** 的循翼 Aerotrace 官网前端。

* **在线演示**：<https://vserdioppagg.sealosbja.site>
* **后端接口**：由 `InsulatorDetection.Server` 提供，详见 API 集成文档

---

## 快速开始

# 1. 安装依赖
npm i

# 2. 启动开发服务器
npm run dev

# 3. 访问
http://localhost:3000

> 如需对接生产后端，请在 `.env.local` 中设置 `NEXT_PUBLIC_BACKEND_URL`。

---

## 项目架构

项目核心目录结构与数据流请查看 👉 **docs/ARCHITECTURE.md**

---

## 功能亮点

* 🔐 **自动认证**：无 Token 时自动注册临时账号并登录
* 🖼️ **智能压缩**：大图自动压缩后上传 / Base64 兜底
* ⚡ **双通道识别**：上传失败自动回退 Base64 识别
* 💡 **拍摄建议**：检测失败时提供优化建议
* 🕹️ **验证面板**：Request / Response 实时查看

---

## 贡献指南

1. Fork & Clone
2. 新建分支 `feat/*` 或 `fix/*`
3. 提交 PR

---

MIT © 2025