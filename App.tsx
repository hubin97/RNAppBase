/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NetInfoProvider } from './src/utils/netinfo-utils';
import { NetInfoToast } from './src/utils/netInfo-toast';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { Provider } from 'react-redux';
import { store } from './src/store';

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <NetInfoProvider>
        <SafeAreaProvider>
          <AppNavigator />
          <NetInfoToast />
        </SafeAreaProvider>
      </NetInfoProvider>
    </Provider>
  );
}

export default App;
