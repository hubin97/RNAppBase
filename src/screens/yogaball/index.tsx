import Icon, { Font } from '@/components/ui/Icon';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { useThemeColors } from '@/hooks/useThemeColor';
import { HeaderRight } from '@/navigation/utils/headerOptions';
import I18n from '@/utils/i18n';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
// import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import { CalendarProvider, WeekCalendar } from 'react-native-calendars';

const YogaBallScreen = () => {
  const route = useRoute();
  const themeColors = useThemeColors();
  const navigation = useNavigation();
  const [selected, setSelected] = useState('');
  // 初始化当前日期
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

  useLayoutEffect(() => {
        navigation.setOptions({
        //title: title,
        headerShown: true,
        headerStyle: {
            backgroundColor: themeColors.background,
        },
        headerBackVisible: false,
        headerBackTitleVisible: false,
        headerTintColor: themeColors.text,
        headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
            textColor: themeColors.text,
        },
        headerLeft: () => (
            <Icon name={'chevron-back'} 
              fontType={Font.Ionicons}
              size={24} 
              color={themeColors.text} onPress={() =>
              navigation.goBack()
            }/>
        ),
        headerRight: () => (
            <HeaderRight
                icon='settings'
                onPress={() => {
                
                }}
            />
        ),
    });
  }, [navigation, themeColors]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={{fontSize: 14, marginLeft: 10, marginTop:10, color: themeColors.text }}>{`Practice schedule`}</ThemedText>
      {/* <Calendar
        onDayPress={day => {
          setSelected(day.dateString);
        }}
        markedDates={{
          [selected]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
        }}
      /> */}
      <CalendarProvider 
          date={currentDate}
          onDateChanged={(date) => {
            // 当日期变化时（例如滑动），更新当前日期状态
            setCurrentDate(date);
          }}
        >
          <WeekCalendar
            // 允许通过滑动切换周
            pagingEnabled={true}
            // 处理日期点击事件
            onDayPress={(day) => {
              setCurrentDate(day.dateString);
            }}
            // 设置一周的第一天，例如 1 表示周一，7 表示周日
            firstDay={7}
            // 可以添加自定义主题
            theme={{
              // 例如，调整周视图的高度
              'stylesheet.weekCalendar.main': {
                container: {
                  height: 70 // 根据你的需要调整高度
                }
              }
            }}
          />
      </CalendarProvider>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 14,
  },
});

export default YogaBallScreen; 