// 集中管理路由名称、页面组件和参数类型

import { HomeStackNavigator } from '../stacks/HomeStackNavigator';
import { ToolsStackNavigator } from '../stacks/ToolsStackNavigator';
import { DiscoverStackNavigator } from '../stacks/DiscoverStackNavigator';
import { MineStackNavigator } from '../stacks/MineStackNavigator';

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
import YogaBallScreen from "@/screens/yogaball/index";
import VideoPlayScreen from '@/screens/video/index';

export const ROUTES = {
  TabHome: 'TabHome',
  TabTools: 'TabTools',
  TabDiscover: 'TabDiscover',
  TabMine: 'TabMine',
  Home: 'Home',
  Tools: 'Tools',
  Discover: 'Discover',
  Mine: 'Mine',
  Profile: 'Profile',
  Settings: 'Settings',
  Login: 'Login',
  Register: 'Register',
  ForgotPassword: 'ForgotPassword',
  // 其他页面按需添加
  WebView: 'WebView',
  VideoPlay: 'VideoPlay',
  YogaBall: 'YogaBall'
} as const;

export const STACKS = {
  Home: HomeStackNavigator,
  Tools: ToolsStackNavigator,
  Discover: DiscoverStackNavigator,
  Mine: MineStackNavigator
  // ... 只放 StackNavigator
};

export const SCREENS = {
  // auth
  [ROUTES.Login]: LoginScreen,
  [ROUTES.Register]: RegisterScreen,
  [ROUTES.ForgotPassword]: ForgotPasswordScreen,
  
  // main
  [ROUTES.Home]: HomeScreen,
  [ROUTES.Tools]: ToolsScreen,
  [ROUTES.Discover]: DiscoverScreen,
  // mine
  [ROUTES.Mine]: MineScreen,
  [ROUTES.Profile]: ProfileScreen,
  [ROUTES.Settings]: SettingsScreen,
  
  // 其他页面按需添加
  [ROUTES.WebView]: WebViewScreen,
  [ROUTES.VideoPlay]: VideoPlayScreen,
  [ROUTES.YogaBall]: YogaBallScreen,
}; 