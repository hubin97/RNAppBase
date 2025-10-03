import Icon, { Font } from '@/components/ui/Icon';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { useThemeColors } from '@/hooks/useThemeColor';
import { HeaderRight } from '@/navigation/utils/headerOptions';
import I18n from '@/utils/i18n';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';

const YogaBallScreen = () => {
    const route = useRoute();
    const themeColors = useThemeColors();
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
        //title: title,
        headerShown: true,
        headerStyle: {
            backgroundColor: themeColors.background,
        },
        headerBackVisible: false,
        headerBackTitleVisible: false,
        headerTintColor: themeColors.text,
        headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
            textColor: themeColors.text,
        },
        headerLeft: () => (
            <Icon name={'chevron-back'} 
              fontType={Font.Ionicons}
              size={24} 
              color={themeColors.text} onPress={() =>
              navigation.goBack()
            }/>
        ),
        headerRight: () => (
            <HeaderRight
                icon='settings'
                onPress={() => {
                
                }}
            />
        ),
    });
  }, [navigation, themeColors]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.text}>{I18n.t('yoga_ball')}</ThemedText>
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

export default YogaBallScreen; 