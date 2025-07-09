import React from 'react';
import I18n from '@/utils/i18n';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES, SCREENS } from '@/navigation/core/routers';
import { createNavigatorOptions } from '@/navigation/utils/headerOptions';
import { MineStackParamList } from '../core/types';

const Stack = createNativeStackNavigator<MineStackParamList>();

export const MineStackNavigator = () => (
  <Stack.Navigator
    screenOptions={createNavigatorOptions({ headerShown: true, showLeft: true })}
  >
    <Stack.Screen
      name={ROUTES.Mine}
      component={SCREENS[ROUTES.Mine]}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={ROUTES.Profile}
      component={SCREENS[ROUTES.Profile]}
      options={{ headerTitle: I18n.t('profile') }}
    />
    <Stack.Screen
      name={ROUTES.Settings}
      component={SCREENS[ROUTES.Settings]}
      options={{ headerTitle: I18n.t('settings') }}
    />
  </Stack.Navigator>
); 