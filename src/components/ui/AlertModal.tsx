/**
 * AlertModal.tsx
 * 标准通用自定义 Modal
 */

import React, { useEffect, useRef } from 'react';
import {
  Modal,
  Animated,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Easing,
  Dimensions,
} from 'react-native';

interface IProps {
  visible: boolean;
  onClose?: () => void;
  animationType?: 'fade' | 'slide';
  children?: React.ReactNode;
  backgroundOpacity?: number; // 背景遮罩透明度
  position?: 'center' | 'bottom'; // 弹出位置
}

const screenHeight = Dimensions.get('window').height;

const AlertModal = ({
  visible,
  onClose,
  animationType = 'fade',
  children,
  backgroundOpacity = 0.4,
  position = 'center',
}: IProps) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(screenHeight)).current;

  // 动画控制
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: backgroundOpacity,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: position === 'bottom' ? screenHeight : 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* 背景遮罩 */}
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={[styles.mask, { opacity: opacity }]}
          />
        </TouchableWithoutFeedback>

        {/* 内容容器 */}
        <Animated.View
          style={[
            styles.content,
            position === 'bottom'
              ? styles.bottom
              : styles.center,
            animationType === 'slide' && position === 'bottom'
              ? { transform: [{ translateY }] }
              : {},
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default AlertModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  mask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  bottom: {
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  center: {
    alignSelf: 'center',
  },
});
