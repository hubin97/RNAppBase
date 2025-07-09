import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES, SCREENS } from '@/navigation/core/routers';
import I18n from '@/utils/i18n';
import { createNavigatorOptions, HeaderRight } from '@/navigation/utils/headerOptions';
import { useDispatch } from 'react-redux';
import { setAuthentication } from '@/store/authSlice';
import { DiscoverStackParamList } from '@/navigation/core/types';

const Stack = createNativeStackNavigator<DiscoverStackParamList>();

export const DiscoverStackNavigator = () => {
  const dispatch = useDispatch();
  return (
    <Stack.Navigator screenOptions={createNavigatorOptions()}>
      <Stack.Screen
        name={ROUTES.Discover}
        component={SCREENS[ROUTES.Discover]}
        options={{
          headerRight: () => (
            <HeaderRight
              text={I18n.t('add')}
              onPress={() => {
                console.log(I18n.t('add'));
                dispatch(setAuthentication(false));
              }}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};