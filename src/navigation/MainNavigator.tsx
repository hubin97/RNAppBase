import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import Icon from 'react-native-vector-icons/Ionicons';

// 导入页面组件
import HomeScreen from '@/screens/HomeScreen';
import ToolsScreen from '@/screens/ToolsScreen';
import DiscoverScreen from '@/screens/DiscoverScreen';
import ProfileScreen from '@/screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          headerShown: true,
          title: '首页',
          tabBarLabel: '首页',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Tools" 
        component={ToolsScreen}
        options={{
          headerShown: false,
          title: '工具',
          tabBarLabel: '工具',
          tabBarIcon: ({ color, size }) => (
            <Icon name="construct-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Discover" 
        component={DiscoverScreen}
        options={{
          headerShown: true,
          title: 'Moment',
          tabBarLabel: 'Moment',
          tabBarIcon: ({ color, size }) => (
            <Icon name="people-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarLabel: '我的',
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}; 