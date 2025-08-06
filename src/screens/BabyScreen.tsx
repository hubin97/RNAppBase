import React, { useState, useEffect, useMemo } from 'react';
import I18n from '@/utils/i18n';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { StyleSheet } from 'react-native';
import { Tabs } from '@ant-design/react-native';
import { useAnimatedReaction, useSharedValue, withTiming, } from "react-native-reanimated";  
import { CartesianChart, Line, useChartTransformState, AreaRange, getTransformComponents, setTranslate, setScale } from 'victory-native';
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
    
    const { state } = useChartTransformState();

    // 数据
    const boy_weight_data = selectedGender === 'boy' ? boy_weight.result.baseDataList : girl_weight.result.baseDataList;
    const boy_height_data = selectedGender === 'boy' ? boy_height.result.baseDataList : girl_height.result.baseDataList;
    const boy_head_data = selectedGender === 'boy' ? boy_head.result.baseDataList : girl_head.result.baseDataList;

    const tabs = [
        { index: 0, title: I18n.t('height') },
        { index: 1, title: I18n.t('weight') },
        { index: 2, title: I18n.t('head') },
    ];

    // 配置图表数据范围
    const domainXRange: [number, number] = [0, 60]; // 年龄范围
    const domainYRange = useMemo<[number, number]>(() => {
        //if (selectedTab === 0) return [20, 160]; // 身高范围
        // 这里如果显示超出可视范围, 又限制y轴滚动, 会有问题
        if (selectedTab === 0) return [20, 120]; // 身高范围
        if (selectedTab === 1) return [0, 30]; // 体重范围
        return [20, 80]; // 头围范围
    }, [selectedTab]);
      
    // 配置图表可视范围
    const viewportXRange: [number, number] = [0, 6]; // X轴视口范围：显示6个刻度
    const viewportYRange = useMemo<[number, number]>(() => {
        if (selectedTab === 0) return [20, 120]; // 身高可视范围
        if (selectedTab === 1) return [0, 30]; // 体重可视范围
        return [20, 80]; // 头围可视范围
    }, [selectedTab]);

    // 测算记录最大值
    // 60月
    const translateXMax: number = -2950
    const translateYMax: number = 0
    // const translateYMax = useMemo<number>(() => {
    //     if (selectedTab === 0) return 120; // 身高可视范围
    //     if (selectedTab === 1) return 0; // 体重可视范围
    //     return 0;
    // }, [selectedTab]);

    // 选择数据
    const chartData = useMemo(() => {
        if (selectedTab === 0) return boy_height_data;  // 身高数据
        if (selectedTab === 1) return boy_weight_data;  // 体重数据
        return boy_head_data;  // 头围数据
    }, [selectedTab]);

    // 限制图表平移范围, 参考：
    // https://github.com/FormidableLabs/victory-native-xl/issues/530
    // https://github.com/FormidableLabs/victory-native-xl/blob/main/example/app/pan-zoom.tsx
    const k = useSharedValue(1);
    const tx = useSharedValue(0);
    const ty = useSharedValue(0);
  
    // 监听是否有平移或缩放行为的变化
    useAnimatedReaction(
      () => {
        return state.panActive.value || state.zoomActive.value;
      },
      (cv, pv) => {
        if (!cv && pv) {
          const vals = getTransformComponents(state.matrix.value);
          k.value = vals.scaleX;
          tx.value = vals.translateX;
          ty.value = vals.translateY;
  
          console.log(vals.translateX, vals.translateY);
          
          k.value = withTiming(1);
          if (vals.translateX > 0) {
            tx.value = withTiming(0);
          }
          if (vals.translateX <= translateXMax) {
            tx.value = withTiming(translateXMax)
          }
          if (vals.translateY < 0) {
            ty.value = withTiming(0);
          }
          if (vals.translateY >= translateYMax) {
            ty.value = withTiming(translateYMax)
          }
        }
      },
    );
  
    //监听 k, tx, ty 的值是否变化
    useAnimatedReaction(
      () => {
        return { k: k.value, tx: tx.value, ty: ty.value };
      },
      ({ k, tx, ty }) => {
        const m = setTranslate(state.matrix.value, tx, ty);
        state.matrix.value = setScale(m, k);
      },
    );

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
                <CartesianChart
                    data={chartData}
                    xKey="mouth"
                    yKeys={["p3", "p50", "p97"]}
                    transformState={state}
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
                    domain={{ 
                        x: domainXRange, 
                        y: domainYRange 
                    }}
                    // 设置视口边界，防止滑动超出数据范围
                    viewport={{
                        x: viewportXRange, // X轴视口范围：显示6个刻度
                        y: viewportYRange, // Y轴视口范围：显示6个刻度
                    }}
                    // 尝试使用更严格的边界限制
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