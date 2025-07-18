import { Platform, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import Icon, { Font } from '@/components/ui/Icon';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from '@/hooks/useThemeColor';

// const DEFAULT_TINT_COLOR = '#333';

type HeaderLeftProps = {
  tintColor?: string;
  onPress?: () => void;
  leftElement?: React.ReactNode;
  showLeft?: boolean;
};

const HeaderLeft = ({ tintColor, onPress, leftElement, showLeft = true }: HeaderLeftProps) => {
  const navigation = useNavigation();
  const themeColor = useThemeColors()

  if (!showLeft) {
    return null;
  }

  // 设置默认返回
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
          marginLeft: -10,
          width: 44,
          height: 44,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        //hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Icon 
          name={'chevron-back'} 
          fontType={Font.Ionicons}
          size={24} 
          color={tintColor || themeColor.text } 
        />
      </TouchableOpacity>
    );
  }

  if (typeof leftElement === 'string') {
    return (
      <TouchableOpacity 
      onPress={handlePress}
      style={{ 
        marginLeft: -5,
        minWidth: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
      }} >
        <Text style={{ color: tintColor || themeColor.text, fontSize: 17, fontWeight: '500' }}>{leftElement}</Text>
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
        marginRight: icon ? -10: -5,
        minWidth: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
      }} 
    >
      {icon ? (
        <Icon           
        name={'chevron-forward'} 
        fontType={Font.Ionicons}
        size={24} 
        color={tintColor || themeColor.text } />
      ) : (
        <Text style={{ fontSize: 16, fontWeight: '500', color: tintColor || themeColor.text }}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

/**
 * 创建导航配置
 * @example
 * // 1. 最简单的使用（显示导航栏和默认返回按钮）
 * options={createNavigatorOptions()}
 * 
 * // 2. 隐藏导航栏
 * options={createNavigatorOptions({ headerShown: false })}
 * 
 * // 3. 显示导航栏但隐藏返回按钮
 * options={createNavigatorOptions({ showLeft: false })}
 * 
 * // 4. 使用文字作为返回按钮
 * options={createNavigatorOptions({ leftElement: '返回' })}
 * 
 * // 5. 使用自定义组件
 * options={createNavigatorOptions({ 
 *   leftElement: <CustomButton /> 
 * })}
 */
export const createNavigatorOptions = (
  options: {
    headerShown?: boolean;    // 控制导航栏是否显示
    showLeft?: boolean;       // 控制左侧按钮是否显示
    leftElement?: React.ReactNode;  // 自定义左侧按钮内容
    headerTitle?: string;     // 导航栏标题
    headerStyle?: object;     // 导航栏样式
    headerTitleStyle?: object; // 标题样式
    tintColor?: string;       // 导航栏文字和图标颜色
  } = {}
): NativeStackNavigationOptions => {
  const { 
    headerShown = true,
    showLeft = false,
    leftElement, 
    headerTitle,
    headerStyle,
    headerTitleStyle,
    tintColor
  } = options;

  const themeColor = useThemeColors()
  return {
    headerShown,
    headerBackVisible: false,
    headerLeft: (props) => (
      <HeaderLeft
        {...props}
        leftElement={leftElement}
        showLeft={showLeft}
        tintColor={tintColor}
      />
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