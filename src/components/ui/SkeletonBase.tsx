import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';

import React from 'react';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { Dimensions, SafeAreaView, View } from 'react-native';

const { width: kW, height: kH } = Dimensions.get('window');

// 扩展 Number 类型以支持迭代
declare global {
  interface Number {
    [Symbol.iterator](): Iterator<number>;
  }
}

Number.prototype[Symbol.iterator] = function* () {
  let i = 0;
  let num = this.valueOf();
  while (i < num) {
    yield i++;
  }
};

type SkeletonSVGChild = React.ReactElement<typeof Rect> | React.ReactElement<typeof Circle>;

interface SkeletonBaseProps {
  /**
   * 只能传递 <Rect />、<Circle /> 等 SVG 元素作为 children
   */
  children: SkeletonSVGChild | SkeletonSVGChild[];
}

// 类型补丁：允许 ContentLoader 接收 children
declare module 'react-content-loader/native' {
  interface IContentLoaderProps {
    children?: React.ReactNode;
  }
}

export const SkeletonBase: React.FC<SkeletonBaseProps> = ({ children }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ContentLoader
          speed={2}
          backgroundColor={colorScheme === 'dark' ? '#2A2A2A' : '#f0f0f0'}
          foregroundColor={colorScheme === 'dark' ? '#3A3A3A' : '#999999'}
        >
          {children}
        </ContentLoader>
      </View>
    </SafeAreaView>
  );
}; 