import React from 'react';
import I18n from '@/utils/i18n';
import ParallaxScrollView from '@/components/ui/ParallaxScrollView';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { RootStackParamList } from '@/navigation/core/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, ImageBackground } from 'react-native';

const ProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <ImageBackground
          source={{ uri: 'https://picsum.photos/800/400' }}
          resizeMode="cover"
          // style={{ width: kW, height: kW }}
          style={styles.headerBackground}
        />
      }>
        <ThemedView style={styles.listContainer}>
          <ThemedText type='title'>测试缩放列表</ThemedText>
        </ThemedView>
      </ParallaxScrollView>
  )
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    backgroundColor: '#999',
  },
  headerBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    //position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default ProfileScreen; 