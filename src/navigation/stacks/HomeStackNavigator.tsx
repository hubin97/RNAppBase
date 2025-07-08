import React from 'react';
import I18n from '@/utils/i18n';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES, SCREENS } from '@/navigation/core/routes';
import { HomeStackParamList } from '../core/types';
import { createNavigatorOptions } from '@/navigation/utils/headerOptions';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStackNavigator = () => (
  <Stack.Navigator screenOptions={createNavigatorOptions({ headerShown: false })}>
    <Stack.Screen
      name={ROUTES.Home}
      component={SCREENS[ROUTES.Home]}
      options={{ title: I18n.t('home') }}
    />
    {/* 如有 Home 相关子页面，可在此添加 */}
  </Stack.Navigator>
); 