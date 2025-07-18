# Provider + React Query 用法示例

本示例基于本项目的 Provider 封装（支持 axios/fetch、插件机制、默认 useAxios: true）+ react-query 统一数据流。

---

## 1. 基础用法

```tsx
import { useQuery } from '@tanstack/react-query';
import { provider } from '@/components/http';

function UserInfo({ userId }: { userId: string }) {
  const { data, isLoading, error } = useQuery(
    ['user', userId],
    () => provider.get(`/user/${userId}`)
  );

  if (isLoading) return <Text>加载中...</Text>;
  if (error) return <Text>出错了: {error instanceof Error ? error.message : String(error)}</Text>;

  return (
    <View>
      <Text>用户名: {data?.name}</Text>
      <Text>邮箱: {data?.email}</Text>
    </View>
  );
}
```

---

## 2. POST/PUT/DELETE 用 useMutation

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { provider } from '@/components/http';

function CreateUserButton() {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (newUser) => provider.post('/user', newUser),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['userList']);
      }
    }
  );

  return (
    <Button
      title="创建用户"
      onPress={() => mutation.mutate({ name: '张三', email: 'zhangsan@example.com' })}
    />
  );
}
```

---

## 3. 分页（useInfiniteQuery）

```tsx
import { useInfiniteQuery } from '@tanstack/react-query';
import { provider } from '@/components/http';

function useUserList(pageSize = 20) {
  return useInfiniteQuery(
    ['userList'],
    ({ pageParam = 1 }) => provider.get(`/users?page=${pageParam}&pageSize=${pageSize}`),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.data.length < pageSize) return undefined;
        return allPages.length + 1;
      }
    }
  );
}

// 组件中
const { data, fetchNextPage, hasNextPage } = useUserList();

<FlatList
  data={data?.pages.flatMap(page => page.data) || []}
  onEndReached={() => hasNextPage && fetchNextPage()}
/>
```

---

## 4. 依赖请求（enabled 控制）

```tsx
import { useQuery } from '@tanstack/react-query';
import { provider } from '@/components/http';

const { data: user, isLoading: userLoading } = useQuery(['user', userId], () =>
  provider.get(`/user/${userId}`)
);

const { data: orders, isLoading: ordersLoading } = useQuery(
  ['orders', user?.id],
  () => provider.get(`/orders?userId=${user.id}`),
  {
    enabled: !!user
  }
);
```

---

## 5. 全局错误处理（QueryClient defaultOptions）

```ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error: unknown) => {
        if (error instanceof Error) {
          if (error.message === '需要重新登录') {
            // 跳转登录页
          }
        }
      }
    },
    mutations: {
      onError: (error: unknown) => {
        // 全局处理所有 useMutation 错误
      }
    }
  }
});
```

---

## 6. 插件机制与 react-query 配合说明

- Provider 的插件（如 responsePlugin、authPlugin、loggerPlugin）会在所有请求前后自动处理认证、业务错误、日志等。
- responsePlugin 抛出的业务异常会被 react-query 捕获，onError 全局处理。
- 这样页面组件只需关心数据和状态，无需重复写 try/catch。

---

如需更多场景示例，欢迎补充！
