import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import { AuthNavigator } from './AuthNavigator';
import { Storage } from '@/utils/storage';
import ProfileScreen from '@/screens/ProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 初始化时检查认证状态
  useEffect(() => {
    const checkAuth = () => {
      const auth = Storage.getBoolean('isAuthenticated');
      setIsAuthenticated(auth ?? false);
    };
    checkAuth();
  }, []);

  // 设置认证状态的方法
  const setAuth = (value: boolean) => {
    Storage.setBoolean('isAuthenticated', value);
    setIsAuthenticated(value);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={TabNavigator} />
        ) : (
          <Stack.Screen 
            name="Auth" 
            component={AuthNavigator}
            initialParams={{ setAuth }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 