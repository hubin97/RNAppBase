// 网络请求相关类型定义

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RequestConfig {
    url: string;
    method: HttpMethod;
    headers?: Record<string, string>;
    body?: string;
    auth?: boolean;
    useAxios?: boolean;
}

export interface Response<T = any> {
    data: T;
    status: number;
}

export interface Plugin {
    prepare?: (config: RequestConfig) => Promise<RequestConfig> | RequestConfig;
    willSend?: (config: RequestConfig) => Promise<void> | void;
    didReceive?: (response: Response) => Promise<any> | any;
}

export interface ProviderConfig {
    baseURL: string;
    timeout: number;
    plugins?: Plugin[];
} 