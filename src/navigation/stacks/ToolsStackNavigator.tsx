import React from 'react';
import I18n from '@/utils/i18n';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES, SCREENS } from '@/navigation/core/routers';
import { createNavigatorOptions } from '@/navigation/utils/headerOptions';
import { ToolsStackParamList } from '../core/types';

const Stack = createNativeStackNavigator<ToolsStackParamList>();

export const ToolsStackNavigator = () => (
  <Stack.Navigator screenOptions={createNavigatorOptions({ headerShown: true })}>
    <Stack.Screen
      name={ROUTES.Tools}
      component={SCREENS[ROUTES.Tools]}
      options={{ title: I18n.t('tools') }}
    />
    <Stack.Screen
      name={ROUTES.YogaBall}
      component={SCREENS[ROUTES.YogaBall]}
      options={{ headerTitle: I18n.t('yoga_ball') }}
    />
  </Stack.Navigator>
); 