# Bloc - 博客与文档管理平台

基于 Next.js 15 构建的现代化博客与文档管理系统，支持多用户协作、富文本编辑和在线内容管理。

## 技术栈

- **前端框架**: Next.js 15 (App Router) + React 19 + TypeScript
- **样式**: Tailwind CSS + shadcn/ui
- **身份认证**: NextAuth.js v5
- **数据库**: PostgreSQL + Prisma ORM
- **富文本编辑器**: Tiptap
- **部署**: Vercel (推荐)

## 功能特性

- ✅ 用户注册与登录（支持邮箱密码 + OAuth）
- ✅ 多用户协作
- ✅ 博客文章管理（创建、编辑、发布）
- ✅ 文档管理（分类、排序）
- ✅ 富文本编辑器（支持 Markdown 快捷键）
- ✅ 草稿保存
- ✅ 响应式设计
- ✅ 暗色模式支持

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 到 `.env` 并配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 数据库连接（使用 Vercel Postgres 或本地 PostgreSQL）
DATABASE_URL="postgresql://user:password@localhost:5432/bloc?schema=public"

# NextAuth 密钥（生成方式：openssl rand -base64 32）
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth 提供商（可选）
GITHUB_ID="your-github-oauth-app-id"
GITHUB_SECRET="your-github-oauth-app-secret"
```

### 3. 初始化数据库

```bash
# 生成 Prisma 客户端
npm run db:generate

# 推送数据库 schema
npm run db:push
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 项目结构

```
bloc/
├── app/                      # Next.js App Router
│   ├── api/                 # API 路由
│   │   ├── auth/           # 认证相关 API
│   │   ├── posts/          # 博客文章 API
│   │   └── docs/           # 文档 API
│   ├── dashboard/          # 控制台页面
│   │   ├── posts/         # 文章管理
│   │   └── docs/          # 文档管理
│   ├── login/             # 登录页面
│   ├── register/          # 注册页面
│   └── layout.tsx         # 根布局
├── components/             # React 组件
│   ├── auth/              # 认证组件
│   ├── editor/            # 编辑器组件
│   ├── ui/                # UI 组件库
│   └── navbar.tsx         # 导航栏
├── lib/                   # 工具函数
│   ├── auth.ts           # NextAuth 配置
│   ├── db.ts             # Prisma 客户端
│   └── utils.ts          # 通用工具
├── prisma/               # Prisma 配置
│   └── schema.prisma     # 数据库模型
└── types/                # TypeScript 类型定义
```

## 数据库模型

### User（用户）

- 支持邮箱密码登录和 OAuth 登录
- 角色系统：ADMIN、AUTHOR、READER

### Post（博客文章）

- 标题、内容、摘要、封面图
- 草稿/发布状态
- 标签系统

### Doc（文档）

- 标题、内容、分类
- 排序功能
- 默认发布

## 使用指南

### 注册账号

1. 访问 `/register` 页面
2. 填写姓名、邮箱和密码
3. 或使用 GitHub OAuth 快速注册

### 创建博客文章

1. 登录后进入控制台 `/dashboard`
2. 点击"管理文章"
3. 点击"新建文章"
4. 使用富文本编辑器编写内容
5. 选择"保存草稿"或"发布"

### 管理文档

1. 在控制台点击"管理文档"
2. 点击"新建文档"
3. 填写标题和分类
4. 编写文档内容并保存

## 部署到 Vercel

### 1. 推送代码到 GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

### 2. 在 Vercel 导入项目

1. 访问 [vercel.com](https://vercel.com)
2. 点击"Import Project"
3. 选择你的 GitHub 仓库
4. 配置环境变量（与 .env 相同）

### 3. 配置数据库

推荐使用 Vercel Postgres：

```bash
# 在 Vercel 项目中添加 Postgres
vercel postgres create
```

或使用 Supabase、PlanetScale 等托管数据库服务。

## 开发命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint

# 数据库相关
npm run db:generate    # 生成 Prisma 客户端
npm run db:push        # 推送 schema 到数据库
npm run db:studio      # 打开 Prisma Studio
```

## 后续优化建议

- [ ] 添加全文搜索功能（Algolia 或 Postgres FTS）
- [ ] 实现图片上传（Uploadthing 或 Cloudinary）
- [ ] 添加评论系统
- [ ] 实现标签管理
- [ ] 添加 RSS 订阅
- [ ] 实现版本历史
- [ ] 添加 SEO 优化
- [ ] 实现博客和文档的前台展示页面
- [ ] 添加暗色模式切换
- [ ] 实现草稿自动保存

## 许可证

MIT
