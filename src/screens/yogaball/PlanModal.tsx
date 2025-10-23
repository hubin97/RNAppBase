import React from 'react';
import { Calendar, CalendarList, DateData } from 'react-native-calendars';
import SheetModal from '@/components/ui/SheetModal';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import I18n from '@/utils/i18n';
import Icon, { Font } from '@/components/ui/Icon';
import { useThemeColors } from '@/hooks/useThemeColor';

const PlanModal = ({ visible, onClose, onOk }: { visible: boolean, onClose: () => void, onOk: () => void }) => {
    const theme = useColorScheme() ?? 'light';
    const themeColor = useThemeColors();
    const backgroundColor= theme == 'light' ? '#f5f5f5' : themeColor.background

    const DAYNAMES_HEIGHT = 56;
    const today = new Date().toISOString().split('T')[0];

    const isSameDay = (d1: Date, d2: DateData) =>
        d1.getFullYear() === d2.year &&
        d1.getMonth() === d2.month - 1 &&
        d1.getDate() === d2.day;

    return (
        <SheetModal height={500} visible={visible} onClose={onClose}>
            <ThemedView style={{ flex: 1, }}>
                <ThemedView style={{ height: DAYNAMES_HEIGHT, backgroundColor: backgroundColor, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16 }}>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }} onPress={onClose}>
                        <Icon name={'chevron-back'} fontType={Font.Ionicons} size={20} color={themeColor.icon } />
                        <ThemedText type='default' style={{ textAlign: 'center', color: themeColor.text }}>{I18n.t('string_cancel')}</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }} onPress={onOk}>
                        <ThemedText type='default' style={{ textAlign: 'center', color: themeColor.text }}>{I18n.t('string_ok')}</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
                <ThemedView style={{ backgroundColor: themeColor.separator, height: 1 }}/>
                <ThemedView style={styles.weekNames}>
                {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                  <ThemedText key={d} style={{ flex: 1, textAlign: 'center', fontWeight: '500', fontSize: 14, color: themeColor.text }}>{d}</ThemedText>
                ))}
                </ThemedView>
                <CalendarList
                    // style={{ flexGrow: 0, paddingBottom: 0 }}
                    // calendarStyle={{ paddingBottom: 0 }}

                    // 垂直滚动翻月
                    horizontal={false}
                    //pagingEnabled={true}
                    showScrollIndicator={false}
                    // 起始日期
                    current={today}
                    pastScrollRange={12}   // 可回溯的月份数
                    futureScrollRange={12} // 可前进的月份数
                    scrollEnabled={true}
                    hideDayNames={true}
                    markedDates={{
                        [today]: { selected: true, disableTouchEvent: true, selectedColor: '#007AFF', selectedTextColor: '#fff' },
                    }}
                    onVisibleMonthsChange={(months) => {
                        console.log('当前可见月份:', months);
                    }}
                    // 自定义每个日期的渲染，强制高度
                    // dayComponent={({ date }: { date: DateData }) => {
                    //     return(
                    //         <ThemedView style={{ height: 44, justifyContent: 'center', alignItems: 'center' }}>
                    //             <ThemedText style={{ color: isSameDay(new Date(), date) ? 'red' : '#111' }}>{date.day}</ThemedText>
                    //         </ThemedView>
                    //     );
                    // }}
                    theme={{
                        selectedDayBackgroundColor: '#007AFF',
                        todayTextColor: '#007AFF',
                    }}
                />
            </ThemedView>
        </SheetModal>
    );
};
    
export default PlanModal;

const styles = StyleSheet.create({
    weekNames: { flexDirection: 'row', justifyContent: 'space-around', height: 56, alignItems: 'center' },
});