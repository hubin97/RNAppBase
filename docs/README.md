# RNAppBase 项目文档

本目录包含 RNAppBase React Native 项目的完整技术文档。

## 📚 文档列表

### 🔧 开发配置文档

- **[CodePush热更新配置文档.md](./CodePush热更新配置文档.md)** - CodePush 热更新完整配置指南

  - CodePush 简介和优缺点
  - 安装和配置步骤
  - Android/iOS 项目配置
  - 发布和管理热更新
  - 最佳实践和常见问题
- **[路由导航使用文档.md](./路由导航使用文档.md)** - React Navigation 路由系统使用指南

  - 项目导航架构概览
  - 路由配置和类型定义
  - 页面跳转和参数传递
  - 头部配置工具使用
  - 最佳实践和调试技巧
- **[Redux状态管理使用文档.md](./Redux状态管理使用文档.md)** - Redux Toolkit 状态管理配置指南

  - Redux Toolkit 架构概览
  - Store 配置和 Slice 开发
  - 组件中的状态使用
  - 数据持久化和异步操作
  - 最佳实践和性能优化

## 🚀 快速开始

### 1. 热更新配置

```bash
# 按照 CodePush 文档配置热更新
# 1. 安装依赖
yarn add react-native-code-push

# 2. 配置项目文件
# 3. 获取部署密钥
# 4. 发布热更新
```

### 2. 路由导航使用

```typescript
// 基本页面跳转
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '@/navigation/core/routers';

const navigation = useNavigation();
navigation.navigate('Mine', { screen: ROUTES.Settings });
```

### 3. Redux 状态管理

```typescript
// 在组件中使用 Redux
import { useSelector, useDispatch } from 'react-redux';
import { setAuthentication } from '@/store/authSlice';

const dispatch = useDispatch();
const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

// 更新状态
dispatch(setAuthentication(true));
```

## 📁 项目结构

```
RNAppBase/
├── docs/                          # 项目文档
│   ├── README.md                  # 文档目录说明
│   ├── CodePush热更新配置文档.md   # 热更新配置文档
│   ├── 路由导航使用文档.md        # 路由导航使用文档
│   └── Redux状态管理使用文档.md   # Redux 状态管理文档
├── src/
│   ├── navigation/                # 导航相关
│   │   ├── core/                 # 核心配置
│   │   ├── stacks/               # 堆栈导航器
│   │   └── utils/                # 工具函数
│   ├── store/                    # Redux 状态管理
│   │   ├── index.ts              # Store 配置
│   │   └── authSlice.ts          # 认证状态
│   ├── screens/                  # 页面组件
│   ├── components/               # 通用组件
│   └── utils/                    # 工具函数
└── ...
```

## 🔍 文档特点

- **完整性**：涵盖从配置到使用的完整流程
- **实用性**：提供大量代码示例和最佳实践
- **可维护性**：结构清晰，便于更新和扩展
- **中文友好**：全中文文档，便于团队理解

## 📝 文档维护

- 文档版本：1.0.0
- 最后更新：2024年7月
- 维护者：开发团队

## 🤝 贡献指南

如需更新文档，请：

1. 确保内容准确性和完整性
2. 保持文档结构的一致性
3. 更新版本号和更新日期
4. 提交前进行内容审查

---

*如有问题或建议，请联系开发团队*
