import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/components/http/queryClient';
import { Provider as ReduxProvider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NetInfoProvider } from './src/utils/netinfo-utils';
import { store } from './src/store';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        <NetInfoProvider>
          <SafeAreaProvider>
            {children}
          </SafeAreaProvider>
        </NetInfoProvider>
      </ReduxProvider>
    </QueryClientProvider>
  );
}; 