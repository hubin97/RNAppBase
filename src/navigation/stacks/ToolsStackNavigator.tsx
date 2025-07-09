import React from 'react';
import I18n from '@/utils/i18n';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES, SCREENS } from '@/navigation/core/routers';
import { createNavigatorOptions } from '@/navigation/utils/headerOptions';
import { ToolsStackParamList } from '../core/types';

const Stack = createNativeStackNavigator<ToolsStackParamList>();

export const ToolsStackNavigator = () => (
  <Stack.Navigator screenOptions={createNavigatorOptions({ headerShown: false })}>
    <Stack.Screen
      name={ROUTES.Tools}
      component={SCREENS[ROUTES.Tools]}
      options={{ title: I18n.t('tools') }}
    />
    {/* 如有 Tools 相关子页面，可在此添加 */}
  </Stack.Navigator>
); 