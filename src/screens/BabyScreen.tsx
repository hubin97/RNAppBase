import React, { useState } from 'react';
import I18n from '@/utils/i18n';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { StyleSheet } from 'react-native';
import { Tabs } from '@ant-design/react-native';
import { CartesianChart, Line } from "victory-native";
import { useThemeColors } from '@/hooks/useThemeColor';

// 获取json文件数据
import boy_weight from '@/screens/jsons/baby_datas/boy_weight.json';
import girl_weight from '@/screens/jsons/baby_datas/girl_weight.json';
import boy_height from '@/screens/jsons/baby_datas/boy_heigh.json';
import girl_height from '@/screens/jsons/baby_datas/girl_heigh.json';
import boy_head from '@/screens/jsons/baby_datas/boy_head.json';
import girl_head from '@/screens/jsons/baby_datas/girl_head.json';

const BabyScreen = () => {
    const themeColors = useThemeColors();
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedGender, setSelectedGender] = useState('boy');

    const boy_weight_data = selectedGender === 'boy' ? boy_weight.result.baseDataList : girl_weight.result.baseDataList;
    const boy_height_data = selectedGender === 'boy' ? boy_height.result.baseDataList : girl_height.result.baseDataList;
    const boy_head_data = selectedGender === 'boy' ? boy_head.result.baseDataList : girl_head.result.baseDataList;

    const tabs = [
        { index: 0, title: I18n.t('height') },
        { index: 1, title: I18n.t('weight') },
        { index: 2, title: I18n.t('head') },
    ];

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={[styles.segmentContainer, { backgroundColor: themeColors.background  }]}> 
                <Tabs
                    style={{ paddingHorizontal: 20, }}
                    tabs={tabs}
                    tabBarBackgroundColor={themeColors.background}
                    tabBarActiveTextColor={themeColors.tabIconSelected}
                    tabBarInactiveTextColor={themeColors.tabIconDefault}
                    tabBarUnderlineStyle={{ backgroundColor: themeColors.background, height: 0 }}
                    renderUnderline={() => null }   
                    tabBarTextStyle={{ fontSize: 16, fontWeight: 'semibold' }}
                    initialPage={selectedTab}
                    onChange={(tab, index) => {
                        setSelectedTab(index);
                    }}
                />  
            </ThemedView>
            <ThemedView style={{ marginTop: 10, paddingHorizontal: 20, height: 300, width: '100%' }}>
                    <CartesianChart data={selectedTab === 0 ? boy_weight_data : selectedTab === 1 ? boy_height_data : boy_head_data} xKey="mouth" yKeys={["p3", "p50", "p97"]}>
                {({ points }) => (
                    <>
                    <Line points={points.p3} color="blue" strokeWidth={2} />
                    <Line points={points.p50} color="red" strokeWidth={2} />
                    <Line points={points.p97} color="green" strokeWidth={2} />
                    </>
                )}
                </CartesianChart>
            </ThemedView>
            <ThemedText style={styles.text}>{I18n.t('baby_chart_desc')}</ThemedText>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  segmentContainer: {
    marginTop: 10,
    height: 44,
    marginHorizontal: 16,
    borderRadius: 22,
    borderWidth: 0.5,
    borderColor: 'gray',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',    
  },
});

export default BabyScreen; 