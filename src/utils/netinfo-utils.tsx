import React, { createContext, useContext, useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

// 1. 定义 context 类型
type NetInfoContextType = {
  isConnected: boolean;
  netInfo: NetInfoState | null;
};

// 2. 创建 context，默认已连接
const NetInfoContext = createContext<NetInfoContextType>({
  isConnected: true,
  netInfo: null,
});

// 3. Provider 组件
export const NetInfoProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [netInfo, setNetInfo] = useState<NetInfoState | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetInfo(state);
    });
    // 首次获取
    NetInfo.fetch().then(setNetInfo);
    return () => unsubscribe();
  }, []);

  return (
    <NetInfoContext.Provider value={{ isConnected: !!netInfo?.isConnected, netInfo }}>
      {children}
    </NetInfoContext.Provider>
  );
};

// 4. 自定义 Hook，方便使用
export const useNetInfo = () => useContext(NetInfoContext); 