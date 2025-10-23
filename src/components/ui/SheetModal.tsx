/**
 * SheetModal.tsx
 * 一个标准的底部弹出模态组件
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Easing,
} from 'react-native';

interface IProps {
  visible: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  backgroundOpacity?: number; // 背景遮罩透明度
  height?: number; // 弹窗高度
  duration?: number; // 动画时长
  closeOnBackdropPress?: boolean; // 点击背景是否关闭
}

const screenHeight = Dimensions.get('window').height;

const SheetModal = ({
  visible,
  onClose,
  children,
  backgroundOpacity = 0.4,
  height = 360,
  duration = 250,
  closeOnBackdropPress = true,
}: IProps) => {
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // 动画效果
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: backgroundOpacity,
          duration: duration - 50,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: height,
          duration: duration - 50,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: duration - 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.wrapper}>
        {/* 背景遮罩 */}
        <TouchableWithoutFeedback
          onPress={closeOnBackdropPress ? onClose : undefined}
        >
          <Animated.View
            style={[
              styles.mask,
              { opacity: opacity },
            ]}
          />
        </TouchableWithoutFeedback>

        {/* 内容区域 */}
        <Animated.View
          style={[
            styles.sheet,
            {
              height,
              transform: [{ translateY }],
            },
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default SheetModal;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  mask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
    overflow: 'hidden',
  },
});
