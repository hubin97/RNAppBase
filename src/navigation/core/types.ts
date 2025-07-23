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
  Baby: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  // 可扩展 Home 相关子页面
};

export type ToolsStackParamList = {
  Tools: undefined;
  // 可扩展 Tools 相关子页面
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