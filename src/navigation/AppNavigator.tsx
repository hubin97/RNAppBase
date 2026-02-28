/**
 * 根导航器
 * 
 * 根据认证状态动态显示不同的导航栈
 */
import React from 'react';
import type { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './config/paramLists';
import { TabNavigator } from './TabNavigator';
import { useColorScheme } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColor';
import { ROOT_STACK_CONFIGS } from './config/navigators';
import { SCREENS } from './config/screens';
import { AuthNavigator } from './config/navigators';

const Stack = createNativeStackNavigator<RootStackParamList>();

// 组件映射（根据 ROOT_STACK_CONFIGS 自动生成）
const COMPONENT_MAP = {
  TabNavigator,
  AuthNavigator,
} as const;

export const AppNavigator = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const scheme = useColorScheme();
  const themeColor = useThemeColors();

  // FIXME: 此处必须设置主题色, 否则tabbar主页跳转二级子页面时, 会看到tabbar隐藏的动画, 底部tabbar区域由白变黑, 割裂感很强
  // 动态生成 theme，确保 background 跟随你的主题色
  const Theme = scheme === 'dark'
    ? { ...DarkTheme, colors: { ...DarkTheme.colors, background: themeColor.background } }
    : { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: themeColor.background } };

  const screens = isAuthenticated 
    ? ROOT_STACK_CONFIGS.authenticated 
    : ROOT_STACK_CONFIGS.unauthenticated;

  return (
    <NavigationContainer theme={Theme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {screens.map((screen) => {
          const component = screen.componentKey 
            ? COMPONENT_MAP[screen.componentKey as keyof typeof COMPONENT_MAP]
            : screen.screenKey 
            ? SCREENS[screen.screenKey as keyof typeof SCREENS]
            : null;
          
          if (!component) return null;
          
          return (
            <Stack.Screen
              key={screen.name}
              name={screen.name as keyof RootStackParamList}
              component={component}
              options={screen.options}
            />
          );
        })}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
