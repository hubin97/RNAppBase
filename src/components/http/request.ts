import { HttpMethod, RequestConfig, Response, Plugin, ProviderConfig } from './types';

import axios from 'axios';

function normalizeHeaders(headers?: any): Record<string, string> {
    if (!headers) return {};
    if (headers instanceof Headers) {
        const obj: Record<string, string> = {};
        headers.forEach((value, key) => {
            obj[key] = value;
        });
        return obj;
    }
    if (Array.isArray(headers)) {
        return Object.fromEntries(headers);
    }
    return headers as Record<string, string>;
}

function setupConfig(
    baseURL: string,
    method: HttpMethod,
    url: string,
    data?: Record<string, any> | string,
    options: RequestInit & { auth?: boolean, useAxios?: boolean } = {}
): RequestConfig {
    const { auth, useAxios, ...rest } = options;
    const isBodyMethod = ['POST', 'PUT', 'PATCH'].includes(method);
    const body = isBodyMethod
        ? (typeof data === 'string' ? data : JSON.stringify(data))
        : undefined;
    const headers = isBodyMethod
        ? { 'Content-Type': 'application/json', ...normalizeHeaders(rest.headers) }
        : normalizeHeaders(rest.headers);
    return {
        url: url.startsWith('http') ? url : `${baseURL}${url}`,
        method,
        headers,
        body,
        auth,
        useAxios: useAxios !== undefined ? useAxios : true // 默认true
    };
}

export class Provider {
    private baseURL: string;
    private timeout: number;
    private plugins: Plugin[];

    constructor(config: ProviderConfig) {
        this.baseURL = config.baseURL;
        this.timeout = config.timeout;
        this.plugins = config.plugins || [];
    }

    private async applyPlugins<T>(
        type: 'prepare' | 'willSend' | 'didReceive',
        data: T
    ): Promise<T> {
        let result = data;
        for (const plugin of this.plugins) {
            const handler = plugin[type];
            if (handler) {
                result = await handler(result as any);
            }
        }
        return result;
    }

    private async handleRequest<T>(config: RequestConfig): Promise<T> {
        // 应用 prepare 插件
        const preparedConfig = await this.applyPlugins('prepare', config);
        // 应用 willSend 插件
        await this.applyPlugins('willSend', preparedConfig);

        let data, status;
        if (preparedConfig.useAxios) {
            // 用 axios 发送请求
            const axiosRes = await axios({
                url: preparedConfig.url,
                method: preparedConfig.method,
                headers: preparedConfig.headers,
                data: preparedConfig.body
            });
            data = axiosRes.data;
            status = axiosRes.status;
        } else {
            // 用 fetch 发送请求
            const response = await fetch(preparedConfig.url, {
                method: preparedConfig.method,
                headers: preparedConfig.headers,
                body: preparedConfig.body
            });
            data = await response.json();
            status = response.status;
        }
        const result: Response = { data, status };
        // 应用 didReceive 插件处理响应
        return await this.applyPlugins('didReceive', result) as T;
    }

    async get<T>(url: string, options: RequestInit & { auth?: boolean, useAxios?: boolean } = {}): Promise<T> {
        return this.handleRequest<T>(setupConfig(this.baseURL, 'GET', url, undefined, options));
    }

    async post<T>(url: string, data?: Record<string, any> | string, options: RequestInit & { auth?: boolean, useAxios?: boolean } = {}): Promise<T> {
        return this.handleRequest<T>(setupConfig(this.baseURL, 'POST', url, data, options));
    }

    async put<T>(url: string, data?: Record<string, any> | string, options: RequestInit & { auth?: boolean, useAxios?: boolean } = {}): Promise<T> {
        return this.handleRequest<T>(setupConfig(this.baseURL, 'PUT', url, data, options));
    }

    async delete<T>(url: string, options: RequestInit & { auth?: boolean, useAxios?: boolean } = {}): Promise<T> {
        return this.handleRequest<T>(setupConfig(this.baseURL, 'DELETE', url, undefined, options));
    }

    async patch<T>(url: string, data?: Record<string, any> | string, options: RequestInit & { auth?: boolean, useAxios?: boolean } = {}): Promise<T> {
        return this.handleRequest<T>(setupConfig(this.baseURL, 'PATCH', url, data, options));
    }
}

