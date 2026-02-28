/**
 * 导航配置（配置项 - 会经常调整）
 * 
 * 此文件包含所有导航器的配置，包括 Stack、Tab、Auth、Root 等
 * 新增页面只需在此文件中修改配置即可
 * 
 * 注意：这是主要的配置文件，会经常修改
 */
import React from 'react';
import type { StackConfig, TabConfig, RootStackScreenConfig } from '../core/types';

// 项目特定导入
import I18n from '@/utils/i18n';
import { HeaderRight } from '../adapters/headerOptions';
import { setAuthentication } from '@/store/authSlice';
import { ROUTES } from './routes';
import { SCREENS } from './screens';
import type {
  HomeStackParamList,
  ToolsStackParamList,
  DiscoverStackParamList,
  MineStackParamList,
  AuthStackParamList,
} from './paramLists';
import { createStackNavigator } from '../core/stackNavigator';
import { createNavigatorOptions } from '../adapters/headerOptions';
import { useDispatch } from 'react-redux';

// ============================================================================
// 辅助函数：创建 Stack Navigator 组件
// ============================================================================

/**
 * 创建标准 Stack Navigator（无需特殊处理）
 */
function createStandardStackNavigator<ParamList extends Record<string, any>>(
  config: StackConfig
) {
  return createStackNavigator<ParamList>({
    config,
    createNavigatorOptions,
  });
}

/**
 * 创建需要 dispatch 的 Stack Navigator
 */
function createStackNavigatorWithDispatch<ParamList extends Record<string, any>>(
  config: StackConfig
) {
  const BaseNavigator = createStackNavigator<ParamList>({
    config,
    createNavigatorOptions,
  });

  return function NavigatorWithDispatch() {
    const dispatch = useDispatch();
    return <BaseNavigator context={{ dispatch }} />;
  };
}

// ============================================================================
// Stack 导航配置
// ============================================================================

export const STACK_CONFIGS: Record<'Home' | 'Tools' | 'Discover' | 'Mine', StackConfig> = {
  Home: {
    screenOptions: { headerShown: false },
    screens: [
      {
        name: ROUTES.Home,
        component: SCREENS[ROUTES.Home],
      },
    ],
  },
  
  Tools: {
    screenOptions: { headerShown: true },
    screens: [
      {
        name: ROUTES.Tools,
        component: SCREENS[ROUTES.Tools],
        options: { headerTitle: I18n.t('tools') },
      },
      {
        name: ROUTES.YogaBall,
        component: SCREENS[ROUTES.YogaBall],
        options: {
          showLeft: true,
          headerTitle: I18n.t('yoga_ball'),
        },
        extraOptions: () => ({
          headerRight: () => (
            <HeaderRight
              icon="settings"
              onPress={() => {
                console.log('YogaBall settings pressed');
              }}
            />
          ),
        }),
      },
      {
        name: ROUTES.VideoPlay,
        component: SCREENS[ROUTES.VideoPlay],
        options: {
          showLeft: true,
          headerTitle: I18n.t('video_play'),
        },
      },
    ],
  },
  
  Discover: {
    screens: [
      {
        name: ROUTES.Discover,
        component: SCREENS[ROUTES.Discover],
        extraOptions: (ctx) => ({
          headerRight: () => (
            <HeaderRight
              text={I18n.t('add')}
              onPress={() => {
                console.log(I18n.t('add'));
                ctx?.dispatch?.(setAuthentication(false));
              }}
            />
          ),
        }),
      },
    ],
  },
  
  Mine: {
    screenOptions: { headerShown: true, showLeft: true },
    screens: [
      {
        name: ROUTES.Mine,
        component: SCREENS[ROUTES.Mine],
        options: { headerShown: false },
      },
      {
        name: ROUTES.Profile,
        component: SCREENS[ROUTES.Profile],
        options: {
          headerTitle: I18n.t('profile'),
          showLeft: true,
        },
      },
      {
        name: ROUTES.Settings,
        component: SCREENS[ROUTES.Settings],
        options: {
          headerTitle: I18n.t('settings'),
          showLeft: true,
        },
      },
    ],
  },
};

// ============================================================================
// Stack Navigator 组件（从配置自动生成）
// ============================================================================

export const HomeStackNavigator = createStandardStackNavigator<HomeStackParamList>(
  STACK_CONFIGS.Home
);

export const ToolsStackNavigator = createStandardStackNavigator<ToolsStackParamList>(
  STACK_CONFIGS.Tools
);

// DiscoverStackNavigator 需要 dispatch，使用特殊处理
export const DiscoverStackNavigator = createStackNavigatorWithDispatch<DiscoverStackParamList>(
  STACK_CONFIGS.Discover
);

export const MineStackNavigator = createStandardStackNavigator<MineStackParamList>(
  STACK_CONFIGS.Mine
);

// ============================================================================
// Tab 导航配置
// ============================================================================

export const TAB_CONFIGS: TabConfig<'Home' | 'Tools' | 'Discover' | 'Mine'>[] = [
  {
    name: ROUTES.TabHome,
    stackKey: 'Home',
    label: I18n.t('home'),
    icon: 'home-outline',
  },
  {
    name: ROUTES.TabTools,
    stackKey: 'Tools',
    label: I18n.t('tools'),
    icon: 'construct-outline',
  },
  {
    name: ROUTES.TabDiscover,
    stackKey: 'Discover',
    label: I18n.t('discover'),
    icon: 'people-outline',
  },
  {
    name: ROUTES.TabMine,
    stackKey: 'Mine',
    label: I18n.t('mine'),
    icon: 'person-outline',
  },
];

// ============================================================================
// 认证栈配置
// ============================================================================

export const AUTH_STACK_CONFIG: StackConfig = {
  screenOptions: { headerShown: false },
  screens: [
    {
      name: ROUTES.Login,
      component: SCREENS[ROUTES.Login],
    },
    {
      name: ROUTES.Register,
      component: SCREENS[ROUTES.Register],
    },
    {
      name: ROUTES.ForgotPassword,
      component: SCREENS[ROUTES.ForgotPassword],
    },
  ],
};

// 认证栈 Navigator 组件
export const AuthNavigator = createStandardStackNavigator<AuthStackParamList>(
  AUTH_STACK_CONFIG
);

// ============================================================================
// 根栈配置（公共路由）
// ============================================================================

export const ROOT_STACK_CONFIGS = {
  // 已登录状态的路由
  authenticated: [
    {
      name: 'Main',
      componentKey: 'TabNavigator',
    },
    {
      name: ROUTES.WebView,
      screenKey: ROUTES.WebView,
    },
  ] as RootStackScreenConfig[],
  
  // 未登录状态的路由
  unauthenticated: [
    {
      name: 'Auth',
      componentKey: 'AuthNavigator',
    },
    {
      name: ROUTES.WebView,
      screenKey: ROUTES.WebView,
    },
  ] as RootStackScreenConfig[],
};
