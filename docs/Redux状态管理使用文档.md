# Redux 状态管理使用文档

## 1. 项目 Redux 架构概览

本项目使用 **Redux Toolkit** 进行状态管理，采用现代化的 Redux 开发模式：

```
src/store/
├── index.ts              # Store 配置和类型导出
├── authSlice.ts          # 认证状态管理
└── [future-slices]      # 其他业务状态管理
```

### 技术栈

- **Redux Toolkit**：官方推荐的状态管理工具
- **React Redux**：React 与 Redux 的集成
- **MMKV Storage**：高性能数据持久化
- **TypeScript**：完整的类型安全支持

---

## 2. Store 配置

### 2.1 主配置文件 (`src/store/index.ts`)

```typescript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // 其他 reducer 按需添加
  },
});

// 推断 RootState 和 AppDispatch 类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 2.2 在 App.tsx 中配置 Provider

```typescript
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';

const App = () => {
  return (
    <Provider store={store}>
      {/* 你的应用组件 */}
    </Provider>
  );
};
```

---

## 3. Slice 开发模式

### 3.1 认证 Slice 示例 (`src/store/authSlice.ts`)

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Storage } from '@/utils/storage';

// 状态接口定义
interface AuthState {
  isAuthenticated: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  loading: boolean;
  error?: string;
}

// 初始状态
const initialState: AuthState = {
  isAuthenticated: Storage.getBoolean('isAuthenticated') ?? false,
  user: Storage.getObject('user'),
  loading: false,
  error: undefined,
};

// 创建 Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 设置认证状态
    setAuthentication: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
      // 持久化存储
      Storage.setBoolean('isAuthenticated', action.payload);
    },
  
    // 设置用户信息
    setUser: (state, action: PayloadAction<AuthState['user']>) => {
      state.user = action.payload;
      if (action.payload) {
        Storage.setObject('user', action.payload);
      } else {
        Storage.delete('user');
      }
    },
  
    // 设置加载状态
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  
    // 设置错误信息
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  
    // 登出
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = undefined;
      state.error = undefined;
      Storage.delete('isAuthenticated');
      Storage.delete('user');
    },
  },
});

// 导出 actions
export const { 
  setAuthentication, 
  setUser, 
  setLoading, 
  setError, 
  logout 
} = authSlice.actions;

// 导出 reducer
export default authSlice.reducer;
```

### 3.2 创建新的 Slice

```typescript
// src/store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  profile: {
    id: string;
    name: string;
    avatar?: string;
  } | null;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notifications: boolean;
  };
}

const initialState: UserState = {
  profile: null,
  preferences: {
    theme: 'auto',
    language: 'zh',
    notifications: true,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserState['profile']>) => {
      state.profile = action.payload;
    },
    updatePreferences: (state, action: PayloadAction<Partial<UserState['preferences']>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
  },
});

export const { setProfile, updatePreferences } = userSlice.actions;
export default userSlice.reducer;
```

---

## 4. 在组件中使用 Redux

### 4.1 基本使用模式

```typescript
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setAuthentication, setUser } from '@/store/authSlice';

const MyComponent = () => {
  // 获取 dispatch 函数
  const dispatch = useDispatch();
  
  // 从 store 中获取状态
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);
  const loading = useSelector((state: RootState) => state.auth.loading);

  // 处理登录
  const handleLogin = async () => {
    try {
      dispatch(setLoading(true));
    
      // 模拟登录 API 调用
      const userData = await loginAPI();
    
      // 更新状态
      dispatch(setUser(userData));
      dispatch(setAuthentication(true));
    
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // 处理登出
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <View>
      {loading ? (
        <Text>加载中...</Text>
      ) : isAuthenticated ? (
        <View>
          <Text>欢迎, {user?.name}</Text>
          <Button title="登出" onPress={handleLogout} />
        </View>
      ) : (
        <Button title="登录" onPress={handleLogin} />
      )}
    </View>
  );
};
```

### 4.2 在导航器中使用

```typescript
// src/navigation/AppNavigator.tsx
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export const AppNavigator = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={TabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

### 4.3 在页面组件中使用

```typescript
// src/screens/auth/LoginScreen.tsx
import { useDispatch } from 'react-redux';
import { setAuthentication, setUser } from '@/store/authSlice';

const LoginScreen = () => {
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      // 登录逻辑
      const userData = await loginAPI();
    
      // 更新 Redux 状态
      dispatch(setUser(userData));
      dispatch(setAuthentication(true));
    
    } catch (error) {
      // 错误处理
      console.error('登录失败:', error);
    }
  };

  return (
    <View>
      <Button title="登录" onPress={handleLogin} />
    </View>
  );
};
```

---

## 5. 数据持久化

### 5.1 Storage 工具类使用

```typescript
import { Storage } from '@/utils/storage';

// 在 Slice 中使用持久化
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: Storage.getBoolean('isAuthenticated') ?? false,
    user: Storage.getObject('user'),
  },
  reducers: {
    setAuthentication: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
      // 自动持久化
      Storage.setBoolean('isAuthenticated', action.payload);
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      // 自动持久化
      Storage.setObject('user', action.payload);
    },
  },
});
```

### 5.2 自定义持久化 Hook

```typescript
// src/hooks/usePersistedState.ts
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Storage } from '@/utils/storage';

export const usePersistedState = <T>(
  key: string,
  selector: (state: RootState) => T,
  action: (value: T) => any
) => {
  const dispatch = useDispatch();
  const value = useSelector(selector);

  useEffect(() => {
    // 组件挂载时从存储中恢复状态
    const persistedValue = Storage.getObject<T>(key);
    if (persistedValue !== undefined) {
      dispatch(action(persistedValue));
    }
  }, [key, dispatch, action]);

  return value;
};
```

---

## 6. 异步操作处理

### 6.1 使用 createAsyncThunk

```typescript
// src/store/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 创建异步 thunk
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
  
    if (!response.ok) {
      throw new Error('登录失败');
    }
  
    return response.json();
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 同步 reducers...
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        // 持久化
        Storage.setObject('user', action.payload);
        Storage.setBoolean('isAuthenticated', true);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
```

### 6.2 在组件中使用异步操作

```typescript
const LoginScreen = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.auth.loading);
  const error = useSelector((state: RootState) => state.auth.error);

  const handleLogin = async () => {
    const result = await dispatch(loginUser({
      email: 'user@example.com',
      password: 'password'
    }));
  
    if (loginUser.fulfilled.match(result)) {
      // 登录成功，导航到主页
      navigation.navigate('Main');
    }
  };

  return (
    <View>
      {loading && <Text>登录中...</Text>}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <Button title="登录" onPress={handleLogin} />
    </View>
  );
};
```

---

## 7. 最佳实践

### 7.1 状态设计原则

```typescript
// ✅ 推荐：扁平化状态结构
interface AppState {
  auth: {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    error: string | null;
  };
  user: {
    profile: UserProfile | null;
    preferences: UserPreferences;
  };
  ui: {
    theme: 'light' | 'dark';
    language: string;
  };
}

// ❌ 避免：深层嵌套状态
interface BadState {
  auth: {
    user: {
      profile: {
        personal: {
          name: string;
          email: string;
        };
      };
    };
  };
}
```

### 7.2 选择器优化

```typescript
// ✅ 推荐：使用 reselect 进行选择器优化
import { createSelector } from '@reduxjs/toolkit';

// 基础选择器
const selectAuth = (state: RootState) => state.auth;
const selectUser = (state: RootState) => state.auth.user;

// 派生选择器
export const selectIsAuthenticated = createSelector(
  [selectAuth],
  (auth) => auth.isAuthenticated
);

export const selectUserName = createSelector(
  [selectUser],
  (user) => user?.name ?? '未登录'
);

export const selectUserPermissions = createSelector(
  [selectUser],
  (user) => user?.permissions ?? []
);
```

### 7.3 类型安全

```typescript
// ✅ 推荐：完整的类型定义
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';

// 类型化的 hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// 在组件中使用
const MyComponent = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  
  // 现在有完整的类型提示
};
```

### 7.4 错误处理

```typescript
// 统一的错误处理
const handleAsyncOperation = async () => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));
  
    const result = await someAsyncOperation();
    dispatch(setData(result));
  
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};
```

---

## 8. 调试和开发工具

### 8.1 Redux DevTools 配置

```typescript
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  // 启用 Redux DevTools
  devTools: process.env.NODE_ENV !== 'production',
});
```

### 8.2 日志中间件

```typescript
// 自定义日志中间件
const loggerMiddleware = (store: any) => (next: any) => (action: any) => {
  console.group(action.type);
  console.info('dispatching', action);
  const result = next(action);
  console.log('next state', store.getState());
  console.groupEnd();
  return result;
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware),
});
```

---

## 9. 常见问题

### Q: 如何添加新的状态模块？

A: 按以下步骤：

1. **创建新的 Slice**：

```typescript
// src/store/userSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { /* 初始状态 */ },
  reducers: { /* reducers */ },
});
```

2. **添加到 Store**：

```typescript
// src/store/index.ts
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer, // 添加新的 reducer
  },
});
```

3. **更新类型定义**：

```typescript
// 类型会自动推断，无需手动更新
```

### Q: 如何处理复杂的状态更新？

A: 使用 Immer 的不可变更新模式：

```typescript
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      // Immer 会自动处理不可变更新
      Object.assign(state.user, action.payload);
    },
  
    addUserPermission: (state, action: PayloadAction<string>) => {
      state.user.permissions.push(action.payload);
    },
  },
});
```

### Q: 如何优化性能？

A: 使用选择器优化和组件优化：

```typescript
// 1. 使用 createSelector 优化选择器
const selectUserPermissions = createSelector(
  [selectUser],
  (user) => user?.permissions ?? []
);

// 2. 使用 React.memo 优化组件
const UserProfile = React.memo(({ userId }: { userId: string }) => {
  const user = useAppSelector(state => 
    state.users.find(u => u.id === userId)
  );
  
  return <View>{/* 组件内容 */}</View>;
});
```

---

## 10. 总结

本项目采用现代化的 Redux 开发模式：

1. **Redux Toolkit**：简化 Redux 开发，减少样板代码
2. **TypeScript**：完整的类型安全支持
3. **数据持久化**：使用 MMKV 进行高性能存储
4. **模块化**：按业务领域组织状态管理
5. **最佳实践**：遵循 Redux 官方推荐模式

按照本文档的规范使用，可以确保状态管理的一致性和可维护性。

---
