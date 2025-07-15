# RNAppBase 项目文档

## 📚 文档索引

### 🏗️ 架构与配置

- [React Native新架构分析文档](./React%20Native新架构分析文档.md) - 新架构概述、组件详解、性能优化
- [React Native原生模块调用指南](./React%20Native原生模块调用指南.md) - TurboModules 使用、性能对比、迁移指南
- [路由导航使用文档](./路由导航使用文档.md) - React Navigation 配置和使用指南
- [Redux状态管理使用文档](./Redux状态管理使用文档.md) - Redux Toolkit 状态管理方案

### 🔧 开发工具

- [CodePush热更新配置文档](./CodePush热更新配置文档.md) - 热更新配置和使用指南

---

## 🚀 快速开始

### 环境要求

- **React Native**: 0.80.1
- **Node.js**: 18+
- **iOS**: 15.1+ (Xcode 15.1+)
- **Android**: API 24+ (Android 7.0+)

### 安装依赖

```bash
# 安装 Node.js 依赖
npm install

# iOS 依赖
cd ios && pod install && cd ..

# 启动开发服务器
npm start
```

### 运行项目

```bash
# iOS
npm run ios

# Android
npm run android
```

---

## 📱 项目特性

### ✨ 核心功能

- 🎨 **主题系统** - 支持深色/浅色主题切换
- 🌍 **国际化** - 多语言支持 (中文/英文)
- 🔄 **状态管理** - Redux Toolkit 集成
- 🧭 **路由导航** - React Navigation 6.x
- 🔧 **开发工具** - 完整的开发环境配置

### 🎯 技术栈

- **框架**: React Native 0.80.1
- **导航**: React Navigation 7.x
- **状态管理**: Redux Toolkit
- **UI组件**: Ant Design Mobile RN
- **动画**: React Native Reanimated 3.x
- **存储**: MMKV
- **网络**: 内置 HTTP 客户端

---

## 📖 文档说明

本文档集合包含了 RNAppBase 项目的完整技术文档，涵盖了从基础配置到高级功能的各个方面。建议按照以下顺序阅读：

1. **新架构分析文档** - 了解新架构的核心概念和优势
2. **原生模块调用指南** - 学习 TurboModules 的使用和性能优化
3. **路由导航使用文档** - 学习导航系统的使用
4. **Redux状态管理使用文档** - 掌握状态管理方案
5. **CodePush热更新配置文档** - 配置热更新功能

---
