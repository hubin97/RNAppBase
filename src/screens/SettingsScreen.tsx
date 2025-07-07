import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import I18n from '@/utils/i18n';
import React from 'react';
import { StyleSheet } from 'react-native';

const SettingsScreen = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.text}>{I18n.t('settings')}</ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
});

export default SettingsScreen; 