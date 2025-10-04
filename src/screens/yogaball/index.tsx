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
// import { CalendarProvider, WeekCalendar } from 'react-native-calendars';
import CustomWeekCalendar from '@/components/ui/WeekCalendar';

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
      <CustomWeekCalendar showHeader={false} onWeekChange={({date, direction}) => {
        console.log('date =>', date, direction);
      }}/>
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