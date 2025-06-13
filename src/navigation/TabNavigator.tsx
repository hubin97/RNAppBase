import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabParamList } from './types';
import Icon from 'react-native-vector-icons/Ionicons';
import { createNavigatorOptions, HeaderRight } from './navigatorOptions';
import { useDispatch } from 'react-redux';
import { setAuthentication } from '@/store/authSlice';

// 导入页面组件
import HomeScreen from '@/screens/HomeScreen';
import ToolsScreen from '@/screens/ToolsScreen';
import DiscoverScreen from '@/screens/DiscoverScreen';
import MineScreen from '@/screens/MineScreen';
import ProfileScreen from '@/screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator();

// 首页导航栈
const HomeStack = () => (
  <Stack.Navigator screenOptions={createNavigatorOptions({ headerShown: false })}>
    <Stack.Screen 
      name="HomeMain" 
      component={HomeScreen}
      options={{
        title: '首页',
      }}
    />
  </Stack.Navigator>
);

// 工具导航栈
const ToolsStack = () => (
  <Stack.Navigator screenOptions={createNavigatorOptions({ headerShown: false })}>
    <Stack.Screen 
      name="ToolsMain" 
      component={ToolsScreen}
      options={{
        title: '工具',
      }}
    />
  </Stack.Navigator>
);

// 发现导航栈
const DiscoverStack = () => {
  const dispatch = useDispatch();
  return (
    <Stack.Navigator screenOptions={createNavigatorOptions()}>
      <Stack.Screen 
        name="DiscoverMain" 
        component={DiscoverScreen}
        options={{
          //title: '圈子',
          headerRight: () => (
            <HeaderRight 
              text="添加"
              onPress={() => {
                console.log('添加');
                dispatch(setAuthentication(false));
              }}
            />
          )
        }}
      />
    </Stack.Navigator>
  );
};

// 我的导航栈
const MineStack = () => (
  <Stack.Navigator 
    screenOptions={createNavigatorOptions({
      headerShown: true,  // 默认显示导航栏
      showLeft: true,     // 默认显示返回按钮
      //leftElement: '返回'  // 自定义返回文案
    })}
  >
    <Stack.Screen 
      name="MineMain" 
      component={MineScreen}
      options={{
        headerShown: false,  // 覆盖默认配置，隐藏导航栏
      }}
    />
    <Stack.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{
        headerTitle: '个人资料',  // 只需要设置标题，其他配置继承自 screenOptions
      }}
    />
  </Stack.Navigator>
);

// 判断是否在子页面
const shouldHideTab = (navigation: any) => {
  const state = navigation.getState();
  return state.routes[state.index].state?.index > 0;
};

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => {
        return {
          headerShown: false,
          tabBarActiveTintColor: '#1E3A8A',
          tabBarInactiveTintColor: '#8E8E93',
          tabBarStyle: {
            display: !shouldHideTab(navigation) ? 'flex' : 'none'
          }
        };
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack}
        options={{
          tabBarLabel: '首页',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Tools" 
        component={ToolsStack}
        options={{
          tabBarLabel: '工具',
          tabBarIcon: ({ color, size }) => (
            <Icon name="construct-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Discover" 
        component={DiscoverStack}
        options={{
          tabBarLabel: '圈子',
          tabBarIcon: ({ color, size }) => (
            <Icon name="people-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Mine" 
        component={MineStack}
        options={{
          tabBarLabel: '我的',
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}; 