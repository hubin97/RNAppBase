/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { AppNavigator } from './src/navigation/AppNavigator';
import { NetInfoToast } from './src/utils/netInfo-toast';
import { AppProvider } from './AppProvider';

export default function App() {
  return (
    <AppProvider>
      <AppNavigator />
      <NetInfoToast />
    </AppProvider>
  );
}
