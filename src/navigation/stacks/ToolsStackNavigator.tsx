import React from 'react';
import I18n from '@/utils/i18n';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES, SCREENS } from '@/navigation/core/routers';
import { createNavigatorOptions, HeaderRight } from '@/navigation/utils/headerOptions';
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
      options={{
        ...createNavigatorOptions({ showLeft: true, headerTitle: I18n.t('yoga_ball') }),
        headerRight: () => (
          <HeaderRight
            icon='settings'
            onPress={() => {
              // TODO: 跳转到设置或其他动作
              console.log('YogaBall settings pressed');
            }}
          />
        ),
      }}
    />
    <Stack.Screen
      name={ROUTES.VideoPlay}
      component={SCREENS[ROUTES.VideoPlay]}
      options={{
        ...createNavigatorOptions({ showLeft: true, headerTitle: I18n.t('video_play') }),
      }}
    />
  </Stack.Navigator>
); 