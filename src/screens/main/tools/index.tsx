import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { useThemeColors } from '@/hooks/useThemeColor';
import I18n from '@/utils/i18n';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ToolsStackParamList } from '@/navigation/core/types';
import { Alert, FlatList, ListRenderItem, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ROUTES, SCREENS } from '@/navigation/core/routers';

export default function ToolsScreen() {

  const navigation = useNavigation<NativeStackNavigationProp<ToolsStackParamList>>();
  const insets = useSafeAreaInsets();
  const themeColor = useThemeColors();

  const dataList = [
    `视频播放`,
    `瑜伽球`,
    `其他类`,
  ]

  const _renderItem: ListRenderItem<any>  = ({ item, index }) => {
    return (
      <ThemedView style={[styles.itemWrapper, { borderBottomColor: themeColor.separator }]}>
          <TouchableOpacity
          style={{ flex:1, justifyContent: 'center', alignItems: 'center',  width: '100%'}}
          activeOpacity={0.7}
          onPress={() => {
            if (index == 0) {
              navigation.navigate(ROUTES.VideoPlay);
            } else if (index == 1) {
              navigation.navigate(ROUTES.YogaBall);
            } else {
              Alert.alert(`开发中`)
            }
          }}>
            <ThemedText type='title' style={{ fontSize: 15 }}>{item}</ThemedText>
          </TouchableOpacity>
      </ThemedView>
    );
  };

  const _renderSeparator = () => (
    <ThemedView style={{ height: 0.5, backgroundColor: themeColor.separator, marginLeft: 16 }} />
  );
  
  return (
    <ThemedView style={styles.container}>
        <FlatList
            keyExtractor={(item: any, index: number) => `${index}`}
            style={[styles.flatlist, {/* marginTop: insets.top*/ }]}
            data={dataList}
            renderItem={_renderItem}
            ItemSeparatorComponent={_renderSeparator}
          />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatlist: {
    flex: 1, 
  },
  itemWrapper: {
    flex:1,
    justifyContent: 'center', 
    alignItems: 'center', 
    borderBottomWidth: 0.5, 
    minHeight: 60, 
  },
}); 