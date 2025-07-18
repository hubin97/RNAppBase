import { Provider } from "@/components/http/request";
import { loggerPlugin } from "@/components/http/plugins";
import { authPlugin, responsePlugin } from "./plugins";

// 环境配置
const ENV = {
  dev: {
      url: 'https://www.wanandroid.com',
  },
  test: {
      url: '',
  },
  prd: {
      url: '',
  }
};

// 当前环境
const baseURL = ENV.dev.url;

export const provider = new Provider({
  baseURL, // 请根据实际情况修改
  timeout: 10000,
  plugins: [loggerPlugin, authPlugin, responsePlugin]
});