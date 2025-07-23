import React from 'react';
import I18n from '@/utils/i18n';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { StyleSheet } from 'react-native';
import { CartesianChart, Line } from "victory-native";

export default function ToolsScreen() {

  const DATA = Array.from({ length: 31 }, (_, i) => ({
    day: i,
    highTmp: 40 + 30 * Math.random(),
  }));
  
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.text}>{I18n.t('tools')}</ThemedText>
      <ThemedView style={{ marginTop: 40, paddingHorizontal: 20, height: 300, width: '100%' }}>
        <CartesianChart data={DATA} xKey="day" yKeys={["highTmp"]}>
          {/* 👇 render function exposes various data, such as points. */}
          {({ points }) => (
            // 👇 and we'll use the Line component to render a line path.
            <Line points={points.highTmp} color="blue" strokeWidth={2} />
          )}
        </CartesianChart>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
}); 