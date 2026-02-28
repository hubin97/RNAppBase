import Icon, { Font } from '@/components/ui/Icon';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { useThemeColors } from '@/hooks/useThemeColor';
import { HeaderRight } from '@/navigation/adapters/headerOptions';
import I18n from '@/utils/i18n';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useLayoutEffect, useState } from 'react';
import { Alert, ImageBackground, ListRenderItem, StyleSheet, TouchableOpacity, useColorScheme, View, ScrollView } from 'react-native';
// import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
// import { CalendarProvider, WeekCalendar } from 'react-native-calendars';
import CustomWeekCalendar from '@/components/ui/WeekCalendar';
import PlanModal from './PlanModal';

const YogaBallScreen = () => {
  const route = useRoute();
  const theme = useColorScheme() ?? 'light';
  const themeColor = useThemeColors();
  const navigation = useNavigation();

  const backgroundColor= theme == 'light' ? '#eee' : themeColor.background

  const [selected, setSelected] = useState('');
  // 初始化当前日期
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [showPlanModal, setShowPlanModal] = useState(false);

  const planList = [
    `计划1`,
    `计划2`,
  ]

  // 计划弹窗
  const _planSheetModel = (
      <PlanModal 
        visible={showPlanModal} 
        onClose={() => setShowPlanModal(false)} 
        onOk={() => {
          setShowPlanModal(false);
          Alert.alert(`计划已保存`);
        }}
      />
  );

  // 小型渲染辅助，供 map 使用（避免传递给 ListRenderItem 导致类型不匹配）
  const renderPlanNode = (item: any, index: number) => (
    <ThemedView style={[styles.itemWrapper, { backgroundColor: theme == 'light' ? '#fff': '#333' }]}>
      <TouchableOpacity
        style={{ flex:1, marginLeft: 16, justifyContent: 'center',  width: '100%'}}
        activeOpacity={0.7}
        onPress={() => setShowPlanModal(true)}>
        <ThemedText type='title' style={{ fontSize: 12, fontWeight: '400' }}>{item}</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );

  // const _renderRecommandItem: ListRenderItem<any>  = ({ item, index }) => {
  //     return (
  //       <ThemedView style={[styles.itemWrapper, { minHeight: 80, borderColor: themeColor.separator, borderWidth: 2 }]}>
  //         <TouchableOpacity
  //           style={{ flex:1, flexDirection: 'row', alignItems: 'center',  width: '100%', paddingHorizontal: 15}}
  //           activeOpacity={0.7}
  //           onPress={() => {
  //               Alert.alert(`开发中`)
  //           }}>
  //             <ThemedView style={{ width: 56, height: 56, borderRadius: 8, backgroundColor: themeColor.separator }}></ThemedView>
  //             <ThemedText numberOfLines={2} style={{ flexShrink: 1, /*maxWidth: '80%',*/ marginLeft: 15, height: 56, fontSize: 12, fontWeight: '400', flexWrap: 'wrap'}}>
  //             {`使用flex布局使用flex布局使用flex布局使用flex布局使用flex布局使用flex布局`}
  //             </ThemedText>
  //         </TouchableOpacity>
  //       </ThemedView>
  //     );
  // };

    const renderRecommandNode = (item: any, index: number) => (
      <ThemedView style={[styles.itemWrapper, { minHeight: 80, borderColor: themeColor.separator, borderWidth: 2 }]}>
        <TouchableOpacity
          style={{ flex:1, flexDirection: 'row', alignItems: 'center',  width: '100%', paddingHorizontal: 15}}
          activeOpacity={0.7}
          onPress={() => { Alert.alert(`开发中`) }}>
          <ThemedView style={{ width: 56, height: 56, borderRadius: 8, backgroundColor: themeColor.separator }}></ThemedView>
          <ThemedText numberOfLines={2} style={{ flexShrink: 1, marginLeft: 15, height: 56, fontSize: 12, fontWeight: '400', flexWrap: 'wrap'}}>
            {`使用flex布局使用flex布局使用flex布局使用flex布局使用flex布局使用flex布局`}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );

  const _renderSeparator = () => (
    <ThemedView style={{ height: 0.5, backgroundColor: themeColor.separator, marginLeft: 16 }} />
  );
  
  // calendar header
  const _calendarHeader = (
    <ThemedText style={{fontSize: 14, marginLeft: 10, marginTop:10, color: themeColor.text, backgroundColor: backgroundColor }}>
      {`Practice schedule`}
    </ThemedText>
  );

  // week
  const _weekView = (
    <CustomWeekCalendar showHeader={false} backgroundColor={backgroundColor} selectedColor='#000' onWeekChange={({date, direction}) => {
      console.log('date =>', date, direction);
    }}/>
  );

  // plan
  // plan 列表（数据量小，直接映射渲染保证顺序流式布局）
  const _planList = (
    <View style={{  paddingTop: 14, backgroundColor: backgroundColor }}>
      {planList.map((item, idx) => (
        <View key={idx}>
          {renderPlanNode(item, idx)}
        </View>
      ))}
    </View>
  );

  // recommand
  const _recommandList = (
    <View style={{  backgroundColor: backgroundColor }}>
      <ThemedText style={{fontSize: 14, marginHorizontal: 20, marginVertical:10, color: themeColor.text }}>{`Recommandation`}</ThemedText>
      {planList.map((item, idx) => (
        <View key={idx}>
          {renderRecommandNode(item, idx)}
        </View>
      ))}
    </View>
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor: backgroundColor }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        { _calendarHeader }
        { _weekView }
        { _planList }
        { _recommandList}
        { _planSheetModel }
      </ScrollView>
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