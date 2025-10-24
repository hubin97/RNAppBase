/**
 * https://github.com/wix/react-native-calendars
 // 主题切换问题
 参考 https://github.com/wix/react-native-calendars/issues/2539
 react-native-calendars 的 theme 属性内部被 StyleSheet.create() 缓存，导致 React 的 re-render 并不会重新应用新主题。所以即使 theme 对象变了，UI 也不会更新。
 */
import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, useColorScheme } from 'react-native';
import { CalendarProvider, WeekCalendar } from 'react-native-calendars';
import Icon, { Font } from '@/components/ui/Icon';
import { useThemeColors } from '@/hooks/useThemeColor';
import * as RNLocalize from 'react-native-localize';

const { width: screenWidth } = Dimensions.get('window');

// 定义 Props 类型
interface CustomWeekCalendarProps {
  showHeader?: boolean;
  headerStyle?: any;
  backgroundColor?: string;
  selectedColor?: string;
  onWeekChange?: (data: { date: string; direction: 'prev' | 'next' | 'scroll' }) => void;
}

const CustomWeekCalendar: React.FC<CustomWeekCalendarProps> = ({ 
  showHeader = true,
  headerStyle = {flex: 1},
  backgroundColor = '#fff',
  selectedColor = '#007AFF',
  onWeekChange,
}) => {
  const theme = useColorScheme() ?? 'light';
  const themeColors = useThemeColors();
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  // 设置背景色
  var backgroundColor = theme == 'light' ? backgroundColor: themeColors.background;
  
  // 默认使用 WeekCalendar 组件的原生高度，不主动设置固定值

  // 周切换函数
  const goToNextWeek = () => {
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const newDate = nextWeek.toISOString().split('T')[0];
    setCurrentDate(newDate);
    onWeekChange?.({ date: newDate, direction: 'next' });
  };

  const goToPrevWeek = () => {
    const prevWeek = new Date(currentDate);
    prevWeek.setDate(prevWeek.getDate() - 7);
    const newDate = prevWeek.toISOString().split('T')[0];
    setCurrentDate(newDate);
    onWeekChange?.({ date: newDate, direction: 'prev' });
  };

  const getWeekRange = () => {
    const current = new Date(currentDate);
    const startOfWeek = new Date(current);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    // 使用用户的完整地区设置（包含时区、日期格式等）
    const locale = RNLocalize.getLocales()[0];
    const timeZone = RNLocalize.getTimeZone();
    
    return {
      start: startOfWeek.toLocaleDateString(locale.languageTag, { 
        month: 'short', 
        day: 'numeric',
        timeZone 
      }),
      end: endOfWeek.toLocaleDateString(locale.languageTag, { 
        month: 'short', 
        day: 'numeric',
        timeZone
      })
    };
  };

  const weekRange = getWeekRange();

  const calendarTheme = useMemo(() => ({
    // FIXME: 必须设置透明，否则会有块白色背景间隙
    calendarBackground: "transparent",
    dayTextColor: themeColors.text,
    monthTextColor: themeColors.text,
  }), [themeColors]);

  return (
    <View style={{ 
      backgroundColor: backgroundColor,
      width: screenWidth,
    }}>
      {/* 动态显示/隐藏的周切换头部 */}
      {showHeader && (
        <View style={[
          {
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            paddingHorizontal: 8,
            paddingVertical: 16,
            borderBottomWidth: 0.5,
            borderBottomColor: themeColors.separator || '#f0f0f0',
            width: '100%',
            backgroundColor: backgroundColor,
          },
          headerStyle
        ]}>
          {/* 左箭头 */}
          <TouchableOpacity 
            onPress={goToPrevWeek}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 60,
            }}
          >
            <Icon 
              name={'chevron-back'} 
              fontType={Font.Ionicons}
              size={20} 
              color={themeColors.text}  
            />
          </TouchableOpacity>
          
          <Text style={{ 
            fontSize: 16, 
            fontWeight: '600', 
            color: themeColors.text 
          }}>
            {weekRange.start} - {weekRange.end}
          </Text>
          
          {/* 右箭头 */}
          <TouchableOpacity 
            onPress={goToNextWeek}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 60,
            }}
          >
            <Icon 
              name={'chevron-forward'} 
              fontType={Font.Ionicons}
              size={20} 
              color={themeColors.text}  
            />
          </TouchableOpacity>
        </View>
      )}

      {/* 周日历 */}
      <CalendarProvider 
        date={currentDate}
        onDateChanged={(date) => {
          setCurrentDate(date);
          onWeekChange?.({ date, direction: 'scroll' });
        }}
      >
        <View style={{
          width: screenWidth,
          backgroundColor: backgroundColor,
        }}>
          <WeekCalendar
            style={{
              width: screenWidth,
              backgroundColor: backgroundColor,
            }}
            key={themeColors.background}
            theme={calendarTheme}
            allowShadow={false}
            pagingEnabled={true}
            horizontal={true}
            bounces={false}
            overScrollMode="never"
            firstDay={7}
            onDayPress={(day) => {
              setCurrentDate(day.dateString);
            }}
            markedDates={{
              [currentDate]: { 
                selected: true, 
                selectedColor: selectedColor,
                selectedTextColor: 'white'
              }
            }}
          />
        </View>
      </CalendarProvider>
    </View>
  );
};

export default CustomWeekCalendar;