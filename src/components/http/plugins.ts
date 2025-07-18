import { MMKV } from 'react-native-mmkv';
import { Plugin, RequestConfig, Response } from './types';

// 通用认证插件工厂
export const createAuthPlugin = (getToken: () => string | null): Plugin => ({
    prepare: async (config: RequestConfig) => {
        if (config.auth === true) {
            try {
                const token = getToken();
                if (token) {
                    return {
                        ...config,
                        headers: {
                            ...config.headers,
                            'Authorization': `Bearer ${token}`
                        }
                    };
                }
            } catch (error) {
                console.error('获取 token 失败:', error);
            }
        }
        return config;
    }
});

// 通用响应处理插件工厂
export const createResponsePlugin = (handleBusinessError: (data: any) => void): Plugin => ({
    didReceive: (response: Response) => {
        const { data, status } = response;
        if (status < 200 || status >= 300) {
            throw new Error(`HTTP Error: ${status}`);
        }
        if (!data || typeof data !== 'object') {
            throw new Error('无效的响应数据');
        }
        handleBusinessError(data); // 业务层自定义处理
        return data.data ?? data;
    }
});

// 通用日志插件
export const loggerPlugin: Plugin = {
    willSend: (config: RequestConfig) => {
        console.log('🚀 Request:', {
            url: config.url,
            method: config.method,
            headers: config.headers,
            auth: config.auth
        });
    },
    didReceive: (response: Response | any) => {
        if (response && typeof response === 'object' && 'data' in response && 'status' in response) {
            console.log('✨ Response:', {
                status: response.status,
                data: response.data
            });
        } else {
            console.log('🎉 Response:', response);
        }
        return response;
    }
};