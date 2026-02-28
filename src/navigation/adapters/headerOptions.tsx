/**
 * Header 选项适配器（项目适配层 - 依赖项目特定逻辑）
 * 
 * 此文件处理项目特定的 Header 配置，如主题、国际化等
 * 其他项目需要根据自身需求实现类似的适配器
 * 
 * 注意：此文件依赖项目的主题系统、国际化等，需要根据项目调整
 */
import React from 'react';
import { Platform, TouchableOpacity, Text, View } from 'react-native';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from '@/hooks/useThemeColor';
import Icon, { Font } from '@/components/ui/Icon';
import type { NavigatorOptionsParams } from '../core/types';

type HeaderLeftProps = {
  tintColor?: string;
  onPress?: () => void;
  leftElement?: React.ReactNode;
  showLeft?: boolean;
};

const HeaderLeft = ({ tintColor, onPress, leftElement, showLeft = true }: HeaderLeftProps) => {
  const navigation = useNavigation();
  const themeColor = useThemeColors();

  if (!showLeft) {
    return null;
  }

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  };

  if (!leftElement) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        style={{
          margin: -3,
          width: 44,
          height: 44,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Icon 
          name={'chevron-back'} 
          fontType={Font.Ionicons}
          size={24} 
          color={tintColor || themeColor.text} 
        />
      </TouchableOpacity>
    );
  }

  if (typeof leftElement === 'string') {
    return (
      <TouchableOpacity 
        onPress={handlePress}
        style={{ 
          margin: -3,
          minWidth: 44,
          height: 44,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: tintColor || themeColor.text, fontSize: 17, fontWeight: '500' }}>
          {leftElement}
        </Text>
      </TouchableOpacity>
    );
  }

  return <View>{leftElement}</View>;
};

// 右侧按钮组件
export const HeaderRight = ({ 
  icon, 
  text, 
  onPress, 
  tintColor 
}: { 
  icon?: string;
  text?: string;
  onPress?: () => void;
  tintColor?: string;
}) => {
  if (!icon && !text) return null;
  
  const themeColor = useThemeColors();

  return (
    <TouchableOpacity 
      onPress={onPress}
      style={{
        margin: -3,
        minWidth: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
      }} 
    >
      {icon ? (
        <Icon           
          name={icon} 
          fontType={Font.Ionicons}
          size={24} 
          color={tintColor || themeColor.text} 
        />
      ) : (
        <Text style={{ fontSize: 16, fontWeight: '500', color: tintColor || themeColor.text }}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

/**
 * 创建导航配置（项目特定适配）
 * 
 * 此函数内部会自动获取 themeColor，无需手动传入
 */
export const createNavigatorOptions = (
  options: NavigatorOptionsParams = {}
): NativeStackNavigationOptions => {
  // 在函数内部调用 hook，确保在组件渲染时执行
  const themeColor = useThemeColors();
  
  const { 
    headerShown = true,
    showLeft = false,
    leftElement, 
    headerTitle,
    headerStyle,
    headerTitleStyle,
    tintColor
  } = options;

  return {
    headerShown,
    headerBackVisible: false,
    headerShadowVisible: false, // 全局隐藏导航栏分割线
    headerLeft: (props) => (
      showLeft ?
      <HeaderLeft
        {...props}
        leftElement={leftElement}
        showLeft={showLeft}
        tintColor={tintColor}
      />: null
    ),
    headerTitle,
    headerTintColor: tintColor,
    headerTitleStyle: {
      fontSize: 17,
      fontWeight: '600',
      color: tintColor || themeColor.text,
      ...headerTitleStyle,
    },
    headerStyle: {
      backgroundColor: themeColor.background,
      ...headerStyle,
    },
  };
};
