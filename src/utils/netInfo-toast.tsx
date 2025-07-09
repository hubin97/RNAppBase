import { useNetInfo } from '@/utils/netinfo-utils';
import { Toast } from '@ant-design/react-native';
import { useEffect, useRef } from 'react';

export const NetInfoToast = () => {
  const { isConnected } = useNetInfo();
  const prev = useRef<boolean | null>(null);

  useEffect(() => {
    if (prev.current !== null && prev.current !== isConnected) {
      console.log(isConnected ? '网络已连接@@' : '网络已断开!!');
      Toast.show(isConnected ? '网络已连接' : '网络已断开', 1);
    }
    prev.current = isConnected;
  }, [isConnected]);

  return null;
};

// export default NetInfoToast; 