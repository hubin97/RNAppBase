# 导航系统架构说明

## 📁 文件结构

```
navigation/
├── core/                    # 固定工具类（通用，可复用，一般不改）
│   ├── types.ts            # 通用类型定义
│   └── stackNavigator.tsx  # 通用 Stack Navigator 创建工具
│
├── config/                  # 配置项（项目特定，会经常调整）
│   ├── routes.ts           # 路由常量定义
│   ├── screens.ts          # 页面组件映射
│   ├── paramLists.ts       # 导航参数类型定义
│   └── navigators.tsx      # 导航配置（Stack/Tab/Auth/Root）
│
├── adapters/                # 项目适配层（项目特定，依赖项目逻辑）
│   └── headerOptions.tsx   # Header 选项适配（依赖项目主题、国际化等）
│
├── AppNavigator.tsx         # 根导航器
└── TabNavigator.tsx         # Tab 导航器
```

## 🎯 设计原则

### 1. **职责分离**

#### `core/` - 固定工具类（通用，可复用）
- **types.ts**: 通用类型定义，不依赖项目特定业务
- **stackNavigator.tsx**: 通用 Stack Navigator 创建工具
- **特点**: 这些文件是固定的工具类，一般不需要修改，可以在其他项目中直接复用

#### `config/` - 配置项（项目特定，会经常调整）
- **routes.ts**: 路由常量定义（新增页面时需要添加）
- **screens.ts**: 页面组件映射（新增页面时需要添加）
- **paramLists.ts**: 导航参数类型定义（新增页面参数时需要更新）
- **navigators.tsx**: 导航配置（新增页面时需要修改）
- **特点**: 这些文件是配置项，会随着业务需求经常调整

#### `adapters/` - 项目适配层（项目特定，依赖项目逻辑）
- **headerOptions.tsx**: Header 选项适配，依赖项目的主题系统、国际化等
- **特点**: 依赖项目特定的业务逻辑，需要根据项目调整

### 2. **可复用性**
- `core/` 目录下的代码可以在其他项目中直接复用
- 只需要实现 `adapters/` 和 `config/` 即可适配新项目

### 3. **集中配置**
- 所有路由配置都在 `config/navigators.tsx` 中
- 新增页面只需修改配置，无需修改其他文件

## 📝 使用指南

### 新增页面（只需修改配置项）

1. **在 `config/routes.ts` 中添加路由常量**
```typescript
export const ROUTES = {
  // ...
  YourNewPage: 'YourNewPage',
} as const;
```

2. **在 `config/screens.ts` 中添加页面组件映射**
```typescript
import YourNewPageScreen from '@/screens/YourNewPage';

export const SCREENS = {
  // ...
  [ROUTES.YourNewPage]: YourNewPageScreen,
};
```

3. **在 `config/paramLists.ts` 中更新参数类型（如需要）**
```typescript
export type YourStackParamList = {
  // ...
  YourNewPage: { id?: string } | undefined;
};
```

4. **在 `config/navigators.tsx` 中添加导航配置**
```typescript
export const STACK_CONFIGS = {
  // ...
  YourStack: {
    screens: [
      {
        name: ROUTES.YourNewPage,
        component: SCREENS[ROUTES.YourNewPage],
        options: {
          headerTitle: I18n.t('your_new_page'),
          showLeft: true,
        },
      },
    ],
  },
};
```

### 在其他项目复用

1. **复制 `core/` 目录**到新项目（固定工具类，不改）
2. **创建 `config/` 目录**，定义项目的路由配置（配置项，会调整）
3. **创建 `adapters/` 目录**，实现项目特定的适配器（项目适配，需调整）

## 🔧 核心组件说明

### `core/stackNavigator.tsx`（固定工具类）
通用的 Stack Navigator 创建工具，接受：
- `config`: Stack 配置
- `createNavigatorOptions`: 项目提供的导航选项创建函数

### `adapters/headerOptions.tsx`（项目适配层）
项目特定的 Header 适配器，处理：
- 主题色获取
- 国际化
- 自定义 Header 组件

### `config/navigators.tsx`（配置项）
集中管理所有导航配置，包括：
- Stack 配置
- Tab 配置
- Auth 配置
- Root 配置
- Navigator 组件生成

## ✨ 优势

1. **通用性**: `core/` 可在多个项目复用
2. **集中管理**: 所有配置在一个地方
3. **类型安全**: 完整的 TypeScript 类型支持
4. **易于维护**: 清晰的职责分离
5. **易于扩展**: 新增页面只需修改配置项
6. **结构清晰**: 固定工具类和配置项明确分离

## 📌 文件分类说明

| 目录/文件 | 类型 | 修改频率 | 说明 |
|---------|------|---------|------|
| `core/` | 固定工具类 | 几乎不改 | 通用逻辑，可复用 |
| `config/routes.ts` | 配置项 | 经常调整 | 路由常量 |
| `config/screens.ts` | 配置项 | 经常调整 | 页面映射 |
| `config/paramLists.ts` | 配置项 | 相对固定 | 参数类型 |
| `config/navigators.tsx` | 配置项 | 经常调整 | 导航配置 |
| `adapters/` | 项目适配 | 根据项目调整 | 项目特定逻辑 |
