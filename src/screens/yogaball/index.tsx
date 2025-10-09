import Icon, { Font } from '@/components/ui/Icon';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { useThemeColors } from '@/hooks/useThemeColor';
import { HeaderRight } from '@/navigation/utils/headerOptions';
import I18n from '@/utils/i18n';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useLayoutEffect, useState } from 'react';
import { Alert, FlatList, ImageBackground, ListRenderItem, StyleSheet, TouchableOpacity } from 'react-native';
// import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
// import { CalendarProvider, WeekCalendar } from 'react-native-calendars';
import CustomWeekCalendar from '@/components/ui/WeekCalendar';

const YogaBallScreen = () => {
  const route = useRoute();
  const themeColor = useThemeColors();
  const navigation = useNavigation();
  const [selected, setSelected] = useState('');
  // 初始化当前日期
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

  const planList = [
    `计划1`,
    `计划2`,
  ]

  // 导航头由导航器层统一配置，页面无需在这里重复设置

  const _renderPlanItem: ListRenderItem<any>  = ({ item, index }) => {
      return (
        <ThemedView style={[styles.itemWrapper]}>
          <TouchableOpacity
            style={{ flex:1, marginLeft: 16, justifyContent: 'center',  width: '100%'}}
            activeOpacity={0.7}
            onPress={() => {
                Alert.alert(`开发中`)
            }}>
              <ThemedText type='title' style={{ fontSize: 12, fontWeight: '400' }}>{item}</ThemedText>
            </TouchableOpacity>
        </ThemedView>
      );
  };

  const _renderRecommandItem: ListRenderItem<any>  = ({ item, index }) => {
      return (
        <ThemedView style={[styles.itemWrapper, { minHeight: 80, borderColor: themeColor.separator, borderWidth: 2 }]}>
          <TouchableOpacity
            style={{ flex:1, flexDirection: 'row', alignItems: 'center',  width: '100%', paddingHorizontal: 15}}
            activeOpacity={0.7}
            onPress={() => {
                Alert.alert(`开发中`)
            }}>
              <ThemedView style={{ width: 56, height: 56, borderRadius: 8, backgroundColor: themeColor.separator }}></ThemedView>
              <ThemedText numberOfLines={2} style={{ flexShrink: 1, /*maxWidth: '80%',*/ marginLeft: 15, height: 56, fontSize: 12, fontWeight: '400', flexWrap: 'wrap'}}>
              {`使用flex布局使用flex布局使用flex布局使用flex布局使用flex布局使用flex布局`}
              </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      );
  };

  const _renderSeparator = () => (
    <ThemedView style={{ height: 0.5, backgroundColor: themeColor.separator, marginLeft: 16 }} />
  );
  
  // week
  const _weekView = (
     <CustomWeekCalendar showHeader={false} backgroundColor='#eee' selectedColor='#000' onWeekChange={({date, direction}) => {
        console.log('date =>', date, direction);
      }}/>
  );

  // plan
  const _planList = (
      <FlatList
        keyExtractor={(item: any, index: number) => `${index}`}
        style={{ marginTop: 80, height: 74 * 2, backgroundColor: '#eee' }}
        data={planList}
        renderItem={_renderPlanItem}
        ItemSeparatorComponent={_renderSeparator}
        initialNumToRender={2}
        scrollEnabled={false}
      />
  );

  // recommand
  const _recommandList = (
    <FlatList
      keyExtractor={(item: any, index: number) => `${index}`}
      style={{ marginTop: 14, backgroundColor: themeColor.background }}
      data={planList}
      renderItem={_renderRecommandItem}
      ItemSeparatorComponent={_renderSeparator}
      ListHeaderComponent={() => (
        <ThemedText style={{fontSize: 14, marginHorizontal: 20, marginVertical:10, color: themeColor.text }}>{`Recommandation`}</ThemedText>
      )}
      initialNumToRender={2}
    />
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={{fontSize: 14, marginLeft: 10, marginTop:10, color: themeColor.text }}>{`Practice schedule`}</ThemedText>
      { _weekView }
      { _planList }
      { _recommandList}
      
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee'
  },
  text: {
    fontSize: 14,
  },
  itemWrapper: {
    flex:1,
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 8,
    marginHorizontal: 20, 
    minHeight: 60, 
    marginBottom: 14,
  },
});

export default YogaBallScreen; 