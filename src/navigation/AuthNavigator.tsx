import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './core/types';
import { ROUTES, SCREENS } from './core/routes';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={ROUTES.Login} component={SCREENS[ROUTES.Login]}/>
      <Stack.Screen name={ROUTES.Register} component={SCREENS[ROUTES.Register]} />
      <Stack.Screen name={ROUTES.ForgotPassword} component={SCREENS[ROUTES.ForgotPassword]} />
    </Stack.Navigator>
  );
}; 