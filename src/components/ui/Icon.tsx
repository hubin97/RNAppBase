import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Foundation from 'react-native-vector-icons/Foundation';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Zocial from 'react-native-vector-icons/Zocial';

// 定义所有可用的字体类型
export type IconFontType = 
  | 'Ionicons'
  | 'MaterialIcons'
  | 'MaterialCommunityIcons'
  | 'FontAwesome'
  | 'FontAwesome5'
  | 'FontAwesome6'
  | 'AntDesign'
  | 'Entypo'
  | 'EvilIcons'
  | 'Feather'
  | 'Fontisto'
  | 'Foundation'
  | 'Octicons'
  | 'SimpleLineIcons'
  | 'Zocial';

// 字体映射表
const iconFonts = {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  Fontisto,
  Foundation,
  Octicons,
  SimpleLineIcons,
  Zocial,
};

export const Font = iconFonts;

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  fontType?: keyof typeof iconFonts | React.ComponentType<any>;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

/**
 * 通用图标组件
 * 支持所有 react-native-vector-icons 字体图集
 * 
 * @example
 * // 使用默认 Ionicons
 * <Icon name="home" size={24} color="#333" />
 * 
 * // 使用指定字体（字符串方式，兼容老用法）
 * <Icon name="home" fontType="MaterialIcons" size={24} color="#333" />
 * 
 * // 使用指定字体（推荐，类型安全且有自动补全）
 * import { Font } from '@/components/ui/Icon';
 * <Icon name="home" fontType={Font.AntDesign} size={24} color="#333" />
 * 
 * // 可点击图标
 * <Icon name="heart" onPress={() => console.log('clicked')} />
 */
const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = '#333',
  fontType = Font.Ionicons,
  style,
  onPress,
}) => {
  const IconComponent =
    typeof fontType === 'string'
      ? iconFonts[fontType as keyof typeof iconFonts]
      : fontType;

  if (!IconComponent) {
    console.warn(`Icon font type "${fontType}" is not supported`);
    return null;
  }

  return (
    <IconComponent
      name={name}
      size={size}
      color={color}
      style={style}
      onPress={onPress}
    />
  );
};

export default Icon; 