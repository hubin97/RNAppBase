/**
 * 导航核心类型定义（固定工具类 - 可复用）
 * 
 * 这些类型定义是通用的，不依赖项目特定的业务逻辑
 * 可以在其他项目中直接复用
 * 
 * 注意：此文件是固定的工具类，一般不需要修改
 */
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import type { Dispatch } from 'redux';

// ============================================================================
// 通用配置类型
// ============================================================================

/** 导航选项参数（基础配置） */
export type NavigatorOptionsParams = {
  headerShown?: boolean;
  showLeft?: boolean;
  leftElement?: React.ReactNode;
  headerTitle?: string;
  headerStyle?: object;
  headerTitleStyle?: object;
  tintColor?: string;
  [key: string]: any; // 允许扩展
};

/** 屏幕选项上下文 */
export type ScreenOptionContext = {
  dispatch?: Dispatch<any>;
  [key: string]: any; // 允许扩展
};

/** 单个屏幕配置 */
export type ScreenConfig<RouteName extends string = string> = {
  name: RouteName;
  component: React.ComponentType<any>;
  // 基础配置（传递给 createNavigatorOptions）
  options?: NavigatorOptionsParams;
  // 额外的自定义选项（如 headerRight）
  extraOptions?: (ctx?: ScreenOptionContext) => Partial<NativeStackNavigationOptions>;
};

/** Stack 导航器配置 */
export type StackConfig<RouteName extends string = string> = {
  // 基础配置（传递给 createNavigatorOptions）
  screenOptions?: NavigatorOptionsParams;
  screens: ScreenConfig<RouteName>[];
};

/** Tab 导航配置 */
export type TabConfig<StackKey extends string = string> = {
  name: string;
  stackKey: StackKey;
  label: string;
  icon: string;
};

/** 根栈屏幕配置 */
export type RootStackScreenConfig = {
  name: string;
  componentKey?: string;
  screenKey?: string;
  options?: NativeStackNavigationOptions;
};
