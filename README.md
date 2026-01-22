# 循翼 Aerotrace

> 🚀 基于 **Next.js 14 + TypeScript** 的循翼 Aerotrace 智能检测系统前端应用

* **在线演示**：<https://vserdioppagg.sealosbja.site>
* **后端接口**：由 `InsulatorDetection.Server` 提供，详见 API 集成文档

---

## 📋 目录

- [快速开始](#快速开始)
- [项目架构](#项目架构)
- [技术栈](#技术栈)
- [功能亮点](#功能亮点)
- [样式系统](#样式系统)
- [API 接口](#api-接口)
- [项目结构](#项目结构)
- [性能优化](#性能优化)
- [部署说明](#部署说明)
- [贡献指南](#贡献指南)

---

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- npm 或 yarn

### 安装步骤

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 访问应用
# 浏览器打开 http://localhost:3000
```

### 环境配置

如需对接生产后端，请在项目根目录创建 `.env.local` 文件并设置：

```env
NEXT_PUBLIC_BACKEND_URL=your_backend_url
```

---

## 🏗️ 项目架构

### 核心架构

项目采用 **Next.js 14 App Router** 架构，基于 TypeScript 开发，提供完整的类型安全支持。

### 数据流

```
用户操作 → 前端验证 → API 请求 → 后端处理 → 返回结果 → 前端展示
```

### 架构说明

项目采用 Next.js 14 App Router 架构，基于 TypeScript 开发，提供完整的类型安全支持。详细的项目结构和数据流请参考下方的"项目结构"和"数据流"部分。

---

## 🛠️ 技术栈

### 核心框架

- **Next.js 14** - React 全栈框架（App Router）
- **TypeScript** - 类型安全的 JavaScript 超集
- **React 18** - UI 库

### UI 组件库

- **Ant Design 5** - 企业级 UI 组件库
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Radix UI** - 无样式 UI 组件基础库

### 状态管理

- **Zustand** - 轻量级状态管理库
- **React Hooks** - React 内置状态管理

### 工具库

- **Axios** - HTTP 客户端
- **React Hook Form** - 表单管理
- **Zod** - 数据验证
- **Day.js** - 日期处理
- **Chart.js** - 数据可视化
- **React Hot Toast** - 通知提示

### 开发工具

- **ESLint** - 代码检查
- **PostCSS** - CSS 处理
- **Autoprefixer** - CSS 兼容性处理

---

## ✨ 功能亮点

### 🔐 认证系统

- **自动认证**：无 Token 时自动注册临时账号并登录
- **用户管理**：完整的用户注册、登录、密码找回功能
- **状态持久化**：用户状态本地存储，刷新不丢失

### 🖼️ 智能图像处理

- **智能压缩**：大图自动压缩后上传，Base64 兜底方案
- **双通道识别**：上传失败自动回退 Base64 识别
- **多格式支持**：支持 JPG、PNG、JPEG 格式
- **文件验证**：自动验证文件类型和大小

### 🔍 检测功能

- **绝缘子检测**：智能识别绝缘子缺陷
- **鸟巢检测**：智能识别输电线路上的鸟巢
- **置信度评分**：提供检测结果的可信度评分
- **位置标记**：可视化展示检测目标位置

### 💡 用户体验

- **拍摄建议**：检测失败时提供优化建议
- **验证面板**：Request / Response 实时查看
- **多语言支持**：中文/英文切换
- **主题切换**：明暗主题模式
- **响应式设计**：适配各种屏幕尺寸

### 📊 数据展示

- **仪表盘**：系统概览和统计数据
- **历史记录**：检测历史记录管理
- **图表分析**：数据可视化展示
- **系统监控**：实时系统状态监控

---

## 🎨 样式系统

### 概述

为了简化 TSX 文件中的 CSS 类管理，项目采用集中的样式配置系统。所有的 Tailwind CSS 类都存储在 `src/styles/component-styles.ts` 文件中，使得代码更加清晰和易于维护。

### 文件结构

```
src/styles/
├── component-styles.ts  # 主要样式配置文件
├── theme-styles.ts      # 主题样式配置
└── menu-styles.ts       # 菜单样式配置
```

### 使用方式

#### 1. 导入样式

```tsx
import { styles, cn } from '@/styles/component-styles'
```

#### 2. 使用预定义样式

```tsx
// 单个样式类
<div className={styles.card.container}>内容</div>

// 组合多个样式类
<div className={cn(styles.card.container, styles.state.loading)}>内容</div>

// 条件样式
<div className={cn(
  styles.button.primary,
  isLoading && styles.state.loading,
  isDisabled && styles.state.disabled
)}>
  按钮
</div>
```

### 样式分类

#### 布局 (layout)
- `container` - 主容器样式
- `page` - 页面级容器
- `section` - 区块容器

#### 头部 (header)
- `container` - 头部容器
- `logo` - Logo 样式
- `title` - 标题样式
- `userInfo` - 用户信息容器
- `logoutButton` - 退出按钮
- `themeToggleWrapper` - 主题切换包装器

#### 表单 (form)
- `container` - 表单容器
- `title` - 表单标题
- `fieldGroup` - 字段组
- `label` - 标签样式
- `input` - 输入框样式
- `divider` - 分割线
- `error` - 错误信息
- `submitButton` - 提交按钮

#### 上传组件 (upload)
- `preview` - 预览容器
- `previewImage` - 预览图片
- `removeButton` - 删除按钮
- `dropZone` - 拖放区域
- `dropZoneIcon` - 拖放区域图标
- `dropZoneText` - 拖放区域文本
- `hiddenInput` - 隐藏输入框

#### 按钮 (button)
- `primary` - 主要按钮
- `secondary` - 次要按钮
- `danger` - 危险按钮
- `icon` - 图标按钮

#### 卡片 (card)
- `container` - 卡片容器
- `header` - 卡片头部
- `body` - 卡片主体
- `footer` - 卡片底部
- `title` - 卡片标题
- `subtitle` - 卡片副标题

#### 状态 (state)
- `disabled` - 禁用状态
- `loading` - 加载状态
- `success` - 成功状态
- `error` - 错误状态
- `warning` - 警告状态

### 辅助函数

#### cn(...classes)

用于组合多个 CSS 类，自动过滤掉 falsy 值。

```tsx
cn(
  styles.button.primary,
  isLoading && styles.state.loading,
  disabled && styles.state.disabled,
  "custom-class"
)
```

### 主题配置

`theme` 对象包含了颜色、间距、圆角等配置：

```tsx
import { theme } from '@/styles/component-styles'

// 使用主题色彩
style={{ color: theme.colors.primary }}

// 使用主题间距
style={{ padding: theme.spacing.md }}
```

### 最佳实践

1. **优先使用预定义样式**：尽量使用已定义的样式类，避免直接写 Tailwind 类
2. **语义化命名**：根据功能而非外观命名样式
3. **组合使用**：利用 `cn` 函数组合多个样式类
4. **一致性**：保持相同组件使用相同的样式
5. **扩展性**：需要新样式时，先在 `component-styles.ts` 中添加

---

## 📡 API 接口

### 认证接口

#### 用户注册
- **路径**: `/api/auth/register`
- **方法**: POST
- **说明**: 用户注册接口

#### 用户登录
- **路径**: `/api/auth/login`
- **方法**: POST
- **说明**: 用户登录接口

### 检测接口

#### 绝缘子检测
- **路径**: `/api/detect`
- **方法**: POST
- **格式**: multipart/form-data
- **参数**:
  - `image`: 图片文件

**响应格式**:
```json
{
  "success": true,
  "data": {
    "detections": [
      {
        "x": 150,
        "y": 200,
        "width": 45,
        "height": 12,
        "confidence": 0.87,
        "type": "insulator"
      }
    ]
  }
}
```

### 系统接口

#### 系统状态
- **路径**: `/api/system/status`
- **方法**: GET
- **说明**: 获取系统资源使用情况（CPU、内存、磁盘）

**响应格式**:
```json
{
  "success": true,
  "data": {
    "cpu": 25,
    "memory": 65,
    "disk": 40
  }
}
```

---

## 📁 项目结构

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API 路由
│   │   ├── auth/                 # 认证相关接口
│   │   │   ├── login/            # 登录接口
│   │   │   └── register/         # 注册接口
│   │   ├── detect/               # 检测接口
│   │   └── system/                # 系统接口
│   │       └── status/           # 系统状态接口
│   ├── dashboard/                # 仪表盘页面
│   ├── insulator-detection/      # 绝缘子检测页面
│   ├── nest-detection/           # 鸟巢检测页面
│   ├── history/                  # 历史记录页面
│   ├── settings/                 # 设置页面
│   ├── aboutus/                  # 关于我们页面
│   ├── login/                    # 登录页面
│   ├── register/                 # 注册页面
│   ├── forgot-password/          # 忘记密码页面
│   ├── layout.tsx                # 根布局
│   ├── page.tsx                  # 主页面
│   └── globals.css               # 全局样式
├── components/                    # 复用组件
│   ├── dashboard/                # 仪表盘组件
│   │   ├── statistic-card.tsx   # 统计卡片
│   │   ├── welcome-card.tsx     # 欢迎卡片
│   │   └── system-status-card.tsx # 系统状态卡片
│   ├── shared/                   # 共享组件
│   │   ├── AppLayout.tsx         # 应用布局
│   │   ├── DetectionResultBox.tsx # 检测结果框
│   │   └── SidebarHeader.tsx     # 侧边栏头部
│   ├── ui/                       # UI 基础组件
│   └── ...                       # 其他组件
├── lib/                          # 工具函数库
│   ├── api-client.ts             # API 客户端
│   ├── api.ts                    # API 封装
│   ├── config.ts                 # 配置文件
│   ├── i18n.ts                   # 国际化配置
│   ├── imageUtils.ts             # 图片处理工具
│   ├── store.ts                  # 状态管理
│   └── utils.ts                  # 通用工具函数
├── styles/                       # 样式文件
│   ├── component-styles.ts       # 组件样式配置
│   ├── theme-styles.ts           # 主题样式配置
│   └── menu-styles.ts            # 菜单样式配置
├── types/                        # TypeScript 类型定义
│   ├── api.ts                    # API 类型
│   └── system.ts                 # 系统类型
└── utils/                        # 工具函数
    └── detection.ts              # 检测相关工具
```

---

## ⚡ 性能优化

### 代码优化

- ✅ **React.memo** - 组件记忆化，减少不必要的重渲染
- ✅ **useMemo/useCallback** - 缓存计算结果和函数引用
- ✅ **代码分割** - 按需加载，减少初始包大小
- ✅ **懒加载** - 图片和组件懒加载

### 图片优化

- ✅ **智能压缩** - 大图自动压缩后上传
- ✅ **Base64 兜底** - 上传失败时使用 Base64 编码
- ✅ **格式优化** - 支持多种图片格式

### 网络优化

- ✅ **请求去重** - 避免重复请求
- ✅ **错误重试** - 自动重试失败的请求
- ✅ **双通道检测** - 上传失败自动回退

### 渲染优化

- ✅ **虚拟滚动** - 长列表虚拟滚动
- ✅ **防抖节流** - 事件处理优化
- ✅ **状态管理优化** - 精确的状态更新

---

## 🚢 部署说明

### 开发环境

```bash
npm run dev
```

### 生产构建

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm run start
```

### Docker 部署

项目包含 Docker 配置，可以使用以下命令构建和运行：

```bash
# 构建镜像
docker build -t aerotrace-frontend .

# 运行容器
docker run -p 3000:3000 aerotrace-frontend
```

### 环境变量

生产环境需要配置以下环境变量：

```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
```

---

## 🤝 贡献指南

### 开发流程

1. **Fork 项目** - Fork 本仓库到你的 GitHub 账号
2. **创建分支** - 从 `main` 分支创建新分支
   ```bash
   git checkout -b feat/your-feature-name
   # 或
   git checkout -b fix/your-bug-fix
   ```
3. **提交更改** - 提交你的更改
   ```bash
   git commit -m "feat: 添加新功能"
   ```
4. **推送分支** - 推送你的分支到远程仓库
   ```bash
   git push origin feat/your-feature-name
   ```
5. **创建 PR** - 在 GitHub 上创建 Pull Request

### 代码规范

- 使用 TypeScript 编写代码
- 遵循 ESLint 规则
- 使用 Prettier 格式化代码
- 编写清晰的注释和文档
- 遵循 Git 提交信息规范（Conventional Commits）

### 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型 (type)**:
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具相关

---

## 📄 许可证

MIT © 2025

---

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- **项目地址**: [GitHub Repository](https://github.com/your-repo)
- **问题反馈**: [Issues](https://github.com/your-repo/issues)

---

**Made with ❤️ by Aerotrace Development Team**
