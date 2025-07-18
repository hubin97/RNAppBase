import { createAuthPlugin, createResponsePlugin } from '@/components/http/plugins';
import { MMKV } from 'react-native-mmkv';

// 创建 MMKV 实例
const mmkv = new MMKV();

export const authPlugin = createAuthPlugin(() => mmkv.getString('token') ?? null);

export const responsePlugin = createResponsePlugin((data) => {
    if (data.errorCode !== 0) {
        if (data.errorCode === 401) {
            mmkv.delete('token');
            throw new Error('需要重新登录');
        }
        throw new Error(data.errorMsg || '请求失败');
    }
}); 