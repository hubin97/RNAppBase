/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';

/**
 * 获取当前主题下的整套颜色对象（推荐主力用法）
 */
export function useThemeColors() {
  const scheme = useColorScheme() ?? 'light';
  return Colors[scheme];
}

/**
 * 获取当前主题下的单个颜色，支持兜底色（特殊场景用）
 */
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];
  return colorFromProps ?? Colors[theme][colorName];
}