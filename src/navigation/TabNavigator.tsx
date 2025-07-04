import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabParamList } from './types';
import Icon from 'react-native-vector-icons/Ionicons';
import { createNavigatorOptions, HeaderRight } from './navigatorOptions';
import { useDispatch } from 'react-redux';
import { setAuthentication } from '@/store/authSlice';
import I18n from '@/utils/i18n';

// 导入页面组件
import HomeScreen from '@/screens/HomeScreen';
import ToolsScreen from '@/screens/ToolsScreen';
import DiscoverScreen from '@/screens/DiscoverScreen';
import MineScreen from '@/screens/MineScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import SettingsScreen from '@/screens/SettingsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator();

// 首页导航栈
const HomeStack = () => (
  <Stack.Navigator screenOptions={createNavigatorOptions({ headerShown: false })}>
    <Stack.Screen 
      name="HomeMain" 
      component={HomeScreen}
      options={{
        title: I18n.t('home'),
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
        title: I18n.t('tools'),
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
              text={I18n.t('add')}
              onPress={() => {
                console.log(I18n.t('add'));
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
      name="Mine" 
      component={MineScreen}
      options={{
        headerShown: false,  // 覆盖默认配置，隐藏导航栏
      }}
    />
    <Stack.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{
        headerTitle: I18n.t('profile'),  // 只需要设置标题，其他配置继承自 screenOptions
      }}
    />
    <Stack.Screen 
      name="Settings" 
      component={SettingsScreen}
      options={{
        headerTitle: I18n.t('settings'),  // 只需要设置标题，其他配置继承自 screenOptions
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
          tabBarLabel: I18n.t('home'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Tools" 
        component={ToolsStack}
        options={{
          tabBarLabel: I18n.t('tools'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="construct-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Discover" 
        component={DiscoverStack}
        options={{
          tabBarLabel: I18n.t('discover'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="people-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Mine" 
        component={MineStack}
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