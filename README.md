# 国学经典网站

一个现代化的国学经典学习平台，提供经典著作、诗词歌赋、名句赏析、知识测验等丰富内容，帮助用户系统学习和了解中国传统文化。

## 特色功能

- 经典书籍：四书五经、诸子百家、历代名著等原文与注释
- 诗词鉴赏：包含唐诗宋词元曲等经典作品
- 知识测验：趣味性国学知识问答，巩固学习成果
- 国学讲堂：专题讲解和课程体系
- 社区互动：读书笔记、心得分享
- 学习中心：个人学习记录和进度管理

## 图片错误处理功能

网站实现了自动图片错误处理系统，当图片加载失败时会：

1. 自动生成带有美观样式的本地占位图
2. 支持不同类型的占位图（书籍封面、头像、文章图片等）
3. 提供一键下载所有失败图片的占位图功能
4. 全局错误捕获和专用组件两种使用方式

### 使用方法

**方法1: 使用全局错误处理（适用于普通img标签）**

```html
<img src="图片地址" class="book-cover" alt="图片描述" />
```

**方法2: 使用专用组件（提供更多功能）**

```html
<ImageWithFallback
  src="图片地址"
  alt="图片描述"
  type="book-cover"
  width="300"
  height="200"
  lazy
  retryOnClick
/>
```

**占位图类型**

- book-cover: 书籍封面
- avatar: 用户头像
- article: 文章图片
- banner: 横幅图片
- quote: 名句配图
- default: 默认类型

## 性能优化特性

本项目实施了多项性能优化措施，确保良好的用户体验：

### 路由优化

- 路由级别代码分割
- 核心页面预加载
- 次要页面懒加载
- 平滑路由过渡动画

### 构建优化

- CSS代码分割
- 静态资源压缩
- 依赖预打包
- 代码分块策略
- 移除开发环境日志

### 加载优化

- 关键CSS内联
- 资源预加载
- DNS预获取
- 首屏加载指示器
- 图片懒加载

### 渲染优化

- 硬件加速
- 图像渲染优化
- 减少重绘和回流
- 性能监控和标记

### 响应式设计

- 移动端适配
- 触屏友好交互
- 减少动画（可选）
- 打印媒体优化

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 技术栈

- Vue 3
- TypeScript
- Vue Router
- Pinia
- TinyVue UI
- Vite

## 浏览器支持

- Chrome
- Firefox
- Safari
- Edge

## 贡献指南

欢迎对本项目提出建议和改进。请阅读[贡献指南](CONTRIBUTING.md)了解如何参与。

## 许可证

本项目采用 [MIT 许可证](LICENSE)。

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
