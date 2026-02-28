/**
 * 路由常量定义（配置项 - 会经常调整）
 * 
 * 定义项目中所有路由的名称常量
 * 新增页面时，需要在此文件中添加路由常量
 */
export const ROUTES = {
  // Tab 路由
  TabHome: 'TabHome',
  TabTools: 'TabTools',
  TabDiscover: 'TabDiscover',
  TabMine: 'TabMine',
  
  // 主页面路由
  Home: 'Home',
  Tools: 'Tools',
  Discover: 'Discover',
  Mine: 'Mine',
  
  // 个人中心相关
  Profile: 'Profile',
  Settings: 'Settings',
  
  // 认证相关
  Login: 'Login',
  Register: 'Register',
  ForgotPassword: 'ForgotPassword',
  
  // 其他页面
  WebView: 'WebView',
  VideoPlay: 'VideoPlay',
  YogaBall: 'YogaBall',
} as const;
