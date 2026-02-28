/**
 * 导航参数类型定义（配置项 - 相对固定）
 * 
 * 定义各个导航栈的参数类型，用于类型安全
 * 新增页面参数时，需要在此文件中更新对应的类型定义
 */
export type RootStackParamList = {
  Main: undefined;
  Auth: undefined;
  WebView: { title: string; url: string };
};

export type TabParamList = {
  TabHome: undefined;
  TabTools: undefined;
  TabDiscover: undefined;
  TabMine: undefined;
};

export type MineStackParamList = {
  Mine: undefined;
  Profile: { userId?: string } | undefined;
  Settings: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  // 可扩展 Home 相关子页面
};

export type ToolsStackParamList = {
  Tools: undefined;
  // 可扩展 Tools 相关子页面
  VideoPlay: undefined;
  YogaBall: undefined;
};

export type DiscoverStackParamList = {
  Discover: undefined;
  // 可扩展 Discover 相关子页面
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};
