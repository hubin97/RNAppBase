/**
 * Tab 导航器
 * 
 * 根据配置自动生成 Tab 导航器，无需手动维护 Stack 组件映射
 */
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useThemeColors } from '@/hooks/useThemeColor';
import { TabParamList } from './config/paramLists';
import {
  TAB_CONFIGS,
  HomeStackNavigator,
  ToolsStackNavigator,
  DiscoverStackNavigator,
  MineStackNavigator,
} from './config/navigators';

const Tab = createBottomTabNavigator<TabParamList>();

// Stack 组件映射（根据 TAB_CONFIGS 自动生成）
const STACK_COMPONENTS = {
  Home: HomeStackNavigator,
  Tools: ToolsStackNavigator,
  Discover: DiscoverStackNavigator,
  Mine: MineStackNavigator,
} as const;

// 判断是否在子页面, 隐藏tabBar
const shouldHideTab = (navigation: any) => {
  const state = navigation.getState();
  return state.routes[state.index].state?.index > 0;
};

export const TabNavigator = () => {
  const themeColor = useThemeColors();
  return (
    <Tab.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: false,
        tabBarActiveTintColor: themeColor.tabIconSelected,
        tabBarInactiveTintColor: themeColor.tabIconDefault,
        tabBarStyle: {
          backgroundColor: themeColor.background,
          display: !shouldHideTab(navigation) ? 'flex' : 'none'
        },
      })}
    >
      {TAB_CONFIGS.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name as keyof TabParamList}
          component={STACK_COMPONENTS[tab.stackKey as keyof typeof STACK_COMPONENTS]}
          options={{
            tabBarLabel: tab.label,
            tabBarIcon: ({ color, size }) => (
              <Icon name={tab.icon} color={color} size={size} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};
