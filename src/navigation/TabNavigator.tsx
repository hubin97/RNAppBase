import React from 'react';
import I18n from '@/utils/i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabParamList } from './core/types';
import { useThemeColors } from '@/hooks/useThemeColor';
import { ROUTES, STACKS } from './core/routers';

const Tab = createBottomTabNavigator<TabParamList>();

// 判断是否在子页面, 隐藏tabBar
const shouldHideTab = (navigation: any) => {
  const state = navigation.getState();
  return state.routes[state.index].state?.index > 0;
};

export const TabNavigator = () => {
  const themeColor = useThemeColors();
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
        tabBarActiveTintColor: themeColor.tabIconSelected,
        tabBarInactiveTintColor: themeColor.tabIconDefault,
        tabBarStyle: {
          backgroundColor: themeColor.background,
          display: !shouldHideTab(navigation) ? 'flex' : 'none'
        },
      })}
    >
      <Tab.Screen
        name={ROUTES.TabHome}
        component={STACKS.Home}
        options={{
          tabBarLabel: I18n.t('home'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.TabTools}
        component={STACKS.Tools}
        options={{
          tabBarLabel: I18n.t('tools'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="construct-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.TabDiscover}
        component={STACKS.Discover}
        options={{
          tabBarLabel: I18n.t('discover'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="people-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.TabMine}
        component={STACKS.Mine}
        options={{
          tabBarLabel: I18n.t('mine'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}; 