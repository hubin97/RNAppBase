import React, { useEffect, useRef, useState } from 'react';
import { Calendar, CalendarList, CalendarProvider, DateData } from 'react-native-calendars';
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
    const weekBackgroundColor = theme == 'light' ? '#f5f5f5' : themeColor.background;
    const weekTextColor = '#999';

    const DAYNAMES_HEIGHT = 56;
    const selectedColor = '#A07AFF';

    const today = new Date().toISOString().split('T')[0];
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

    const isSameDay = (d1: Date, d2: Date) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

    // 参考 https://github.com/wix/react-native-calendars/issues/2539
    // react-native-calendars 的 theme 属性内部被 StyleSheet.create() 缓存，导致 React 的 re-render 并不会重新应用新主题。所以即使 theme 对象变了，UI 也不会更新。
    const calendarTheme = React.useMemo(() => ({
        calendarBackground: "transparent",
        selectedDayBackgroundColor: '#007AFF',
        todayTextColor: '#007AFF',
        dayTextColor: themeColor.text,
        monthTextColor: themeColor.text,
    }), [themeColor]);

    return (
        <SheetModal height={500} visible={visible} onClose={onClose}>
            <ThemedView style={{ flex: 1, }}>
                <ThemedView style={{ height: DAYNAMES_HEIGHT, backgroundColor: weekBackgroundColor, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16 }}>
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
                  <ThemedText key={d} style={{ flex: 1, textAlign: 'center', fontWeight: '500', fontSize: 14, color: weekTextColor }}>{d}</ThemedText>
                ))}
                </ThemedView>
                <CalendarList
                    key={themeColor.text} // ✅ 强制重新渲染
                    style={{ backgroundColor: themeColor.background }}
                    // calendarStyle={{ backgroundColor: themeColor.background }}
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
                    onDayPress={(dateData) => {
                        console.log('选择日期:', dateData);
                        //const dateObj = new Date(dateData.dateString);
                        setCurrentDate(dateData.dateString);
                    }}
                    markedDates={{
                        [currentDate]: { 
                            selected: true, 
                            selectedColor: selectedColor,
                            selectedTextColor: 'white'}
                    }}
                    onVisibleMonthsChange={(months) => {
                        console.log('当前可见月份:', months);
                    }}
                    theme={calendarTheme}
                />
            </ThemedView>
        </SheetModal>
    );
};
    
export default PlanModal;

const styles = StyleSheet.create({
    weekNames: { flexDirection: 'row', justifyContent: 'space-around', height: 56, alignItems: 'center' },
});