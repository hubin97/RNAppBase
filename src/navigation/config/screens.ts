/**
 * 页面组件映射（配置项 - 会经常调整）
 * 
 * 将路由名称映射到对应的页面组件
 * 新增页面时，需要在此文件中添加页面组件映射
 */
import { ROUTES } from './routes';

// 页面组件导入
import HomeScreen from '@/screens/main/home/index';
import ToolsScreen from '@/screens/main/tools/index';
import DiscoverScreen from '@/screens/main/DiscoverScreen';
import MineScreen from '@/screens/main/MineScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import ForgotPasswordScreen from '@/screens/auth/ForgotPasswordScreen';
import WebViewScreen from '@/components/ui/ThemedWebView';
import YogaBallScreen from '@/screens/yogaball/index';
import VideoPlayScreen from '@/screens/video/index';

export const SCREENS = {
  // 认证页面
  [ROUTES.Login]: LoginScreen,
  [ROUTES.Register]: RegisterScreen,
  [ROUTES.ForgotPassword]: ForgotPasswordScreen,
  
  // 主页面
  [ROUTES.Home]: HomeScreen,
  [ROUTES.Tools]: ToolsScreen,
  [ROUTES.Discover]: DiscoverScreen,
  [ROUTES.Mine]: MineScreen,
  
  // 个人中心相关
  [ROUTES.Profile]: ProfileScreen,
  [ROUTES.Settings]: SettingsScreen,
  
  // 其他页面
  [ROUTES.WebView]: WebViewScreen,
  [ROUTES.VideoPlay]: VideoPlayScreen,
  [ROUTES.YogaBall]: YogaBallScreen,
};
