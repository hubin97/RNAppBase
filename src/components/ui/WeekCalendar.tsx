/**
 * https://github.com/wix/react-native-calendars
 * 遗留问题
 * 1.夜间模式,多一块背景颜色没找到方法修改
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { CalendarProvider, WeekCalendar } from 'react-native-calendars';
import Icon, { Font } from '@/components/ui/Icon';
import { useThemeColors } from '@/hooks/useThemeColor';

const { width: screenWidth } = Dimensions.get('window');

// 定义 Props 类型
interface CustomWeekCalendarProps {
  showHeader?: boolean;
  headerStyle?: any;
  onWeekChange?: (data: { date: string; direction: 'prev' | 'next' | 'scroll' }) => void;
}

const CustomWeekCalendar: React.FC<CustomWeekCalendarProps> = ({ 
  showHeader = true,
  headerStyle = {},
  onWeekChange,
}) => {
  const themeColors = useThemeColors();
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

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
    
    return {
      start: startOfWeek.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
      end: endOfWeek.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
    };
  };

  const weekRange = getWeekRange();

  return (
    <View style={{ 
      backgroundColor: themeColors.background,
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
            backgroundColor: themeColors.background,
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
          height: showHeader ? 80 : 100,
          backgroundColor: themeColors.background,
        }}>
          <WeekCalendar
            style={{
              width: screenWidth,
              height: showHeader ? 80 : 100,
              backgroundColor: themeColors.background,
            }}
            calendarHeight={showHeader ? 80 : 100}
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
                selectedColor: '#007AFF',
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