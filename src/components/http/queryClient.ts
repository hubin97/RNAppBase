import { QueryClient } from '@tanstack/react-query';

//TODO: 全局网络错误处理

// http 组件 axios/fetch + query 组合使用
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error: unknown) => {
        // 全局处理所有 useQuery 错误
        if (error instanceof Error) {
          if (error.message === '需要重新登录') {
            // TODO: 跳转登录页（如用全局导航/事件总线/全局状态等）
            // 例如：navigate('Login') 或 EventBus.emit('forceLogout')
          }
        }
      },
      // 你还可以配置 retry、staleTime、cacheTime 等
      // retry: 1,
      // staleTime: 1000 * 60,
    } as any, // 兼容类型推断
    mutations: {
      onError: (error: unknown) => {
        // 全局处理所有 useMutation 错误
      }
    }
  }
}); 