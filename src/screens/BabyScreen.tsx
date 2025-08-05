import React, { useState, useEffect } from 'react';
import I18n from '@/utils/i18n';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { StyleSheet } from 'react-native';
import { Tabs } from '@ant-design/react-native';
import { CartesianChart, Line, useChartTransformState, AreaRange } from 'victory-native';
import { useThemeColors } from '@/hooks/useThemeColor';
import { useFont } from '@shopify/react-native-skia';
// https://www.fontspace.com/category/calligraphy
import SacrificeDemo from "@/assets/fonts/SacrificeDemo-8Ox1B.ttf";

// 获取json文件数据
import boy_weight from '@/screens/jsons/baby_datas/boy_weight.json';
import girl_weight from '@/screens/jsons/baby_datas/girl_weight.json';
import boy_height from '@/screens/jsons/baby_datas/boy_heigh.json';
import girl_height from '@/screens/jsons/baby_datas/girl_heigh.json';
import boy_head from '@/screens/jsons/baby_datas/boy_head.json';
import girl_head from '@/screens/jsons/baby_datas/girl_head.json';

const BabyScreen = () => {
    const font = useFont(SacrificeDemo, 12);

    const themeColors = useThemeColors();
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedGender, setSelectedGender] = useState('boy');
    const transformState = useChartTransformState({
        scaleX: 1.0, // 保持正常X轴比例，禁用缩放
        scaleY: 1.0, // 保持正常Y轴比例，禁用缩放
    });

    // 监听变换状态，控制交互行为
    useEffect(() => {
        if (transformState.state.panActive.value) {
            console.warn('用户正在拖拽图表');
        }
        
        if (transformState.state.zoomActive.value) {
            console.warn('用户正在缩放图表');
        }

        // 检查并限制边界
        const matrix = transformState.state.matrix.value;
        const offset = transformState.state.offset.value;
        
        // 如果滑动超出了数据范围，重置到边界
        if (offset[12] < 0) { // X轴偏移小于0
            console.warn('检测到滑动超出左边界，已限制');
        }
        if (offset[12] > 60) { // X轴偏移大于60
            console.warn('检测到滑动超出右边界，已限制');
        }
    }, [transformState.state]);

    const boy_weight_data = selectedGender === 'boy' ? boy_weight.result.baseDataList : girl_weight.result.baseDataList;
    const boy_height_data = selectedGender === 'boy' ? boy_height.result.baseDataList : girl_height.result.baseDataList;
    const boy_head_data = selectedGender === 'boy' ? boy_head.result.baseDataList : girl_head.result.baseDataList;

    const tabs = [
        { index: 0, title: I18n.t('height') },
        { index: 1, title: I18n.t('weight') },
        { index: 2, title: I18n.t('head') },
    ];

    // 选择数据
    let chartData;
    if (selectedTab === 0) chartData = boy_height_data;  // 身高数据
    else if (selectedTab === 1) chartData = boy_weight_data;  // 体重数据
    else chartData = boy_head_data;  // 头围数据

    // 调试信息：检查数据范围
    console.log('当前选中的数据:', selectedTab === 0 ? '身高' : selectedTab === 1 ? '体重' : '头围');
    console.log('数据长度:', chartData.length);
    console.log('第一个数据点:', chartData[0]);
    console.log('最后一个数据点:', chartData[chartData.length - 1]);

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
                {/* Skia 版 victory-native 当前不支持自定义显示坐标轴和刻度，只能通过 formatXLabel/formatYLabel 格式化刻度文本，坐标轴和刻度线由库自动渲染。 */}
                <CartesianChart
                    data={chartData}
                    xKey="mouth"
                    yKeys={["p3", "p50", "p97"]}
                    transformState={transformState.state}
                    // 配置手势：禁用缩放，只启用X轴平移
                    transformConfig={{
                        pan: {
                            enabled: true,
                            dimensions: "x", // 只允许X轴平移
                        },
                        pinch: {
                            enabled: false, // 禁用缩放
                        },
                    }}
                    // 设置X轴范围为0-60，Y轴根据实际数据范围调整
                    domain={{ x: [0, 60], y: [40, 120] }}
                    // 设置视口边界，防止滑动超出数据范围
                    viewport={{
                        x: [0, 6], // X轴视口范围：显示6个刻度
                        y: [40, 100], // Y轴视口范围：显示6个刻度
                    }}
                    axisOptions={{
                        font,
                        labelColor: themeColors.text,
                        // 明确指定X, Y轴刻度数量
                        tickCount: { x: 60, y: 6 },
                        formatXLabel: (value) => value.toString(),
                        formatYLabel: (value) => value.toString(),
                    }}
                >
                    {({ points }) => (
                        <>
                            <Line points={points.p3} color="#fff" strokeWidth={1} />
                            <Line points={points.p50} color="#eee" strokeWidth={1} />
                            <Line points={points.p97} color="#fff" strokeWidth={1} />

                            <AreaRange upperPoints={points.p97} lowerPoints={points.p3} color="rgba(100, 100, 255, 0.2)" />
                            {/* <AreaRange upperPoints={points.p50} lowerPoints={points.p3} color="rgba(100, 100, 255, 0.2)" /> */}
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
    marginTop: 32,
    fontSize: 16,
    textAlign: 'center',    
  },
});

export default BabyScreen; 