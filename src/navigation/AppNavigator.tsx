import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import { AuthNavigator } from './AuthNavigator';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { useColorScheme } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColor';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const scheme = useColorScheme();
  const themeColor = useThemeColors();

  // FIXME: 此处必须设置主题色, 否则tabbar主页跳转二级子页面时, 会看到tabbar隐藏的动画, 底部tabbar区域由白变黑, 割裂感很强
  // 动态生成 theme，确保 background 跟随你的主题色
  const Theme = scheme === 'dark'
    ? { ...DarkTheme, colors: { ...DarkTheme.colors, background: themeColor.background } }
    : { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: themeColor.background } };

  // 可以选择在这里添加一个 useEffect 来初始化认证状态，但通常这会在 authSlice 中处理
  // 或者在 App.tsx 的 Provider 之外进行初始化检查
  return (
    <NavigationContainer theme={Theme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={TabNavigator} />
        ) : (
          <Stack.Screen 
            name="Auth" 
            component={AuthNavigator}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 