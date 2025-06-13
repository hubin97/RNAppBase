import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import { AuthNavigator } from './AuthNavigator';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // 可以选择在这里添加一个 useEffect 来初始化认证状态，但通常这会在 authSlice 中处理
  // 或者在 App.tsx 的 Provider 之外进行初始化检查

  return (
    <NavigationContainer>
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