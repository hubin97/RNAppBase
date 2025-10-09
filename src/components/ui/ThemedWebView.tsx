import React, { useLayoutEffect, useState } from "react";
import Icon, { Font } from "./Icon";
import { Dimensions, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { ThemedView } from "./ThemedView";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from '@react-navigation/native';

const { width: kW, height: kH } = Dimensions.get('window');

type Props = {
    title: string,
    url: string
};
  
export default function WebViewScreen() {
  
  const route = useRoute();
  const themeColors = useThemeColors();
  const navigation = useNavigation();

  // @ts-ignore
  const { title, url = '' } = route.params || {};
  const [progress, setProgress] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
        title: title,
        headerShown: true,
        headerStyle: {
            backgroundColor: themeColors.background,
        },
        headerBackVisible: false,
        headerBackTitleVisible: false,
        headerTintColor: themeColors.text,
        headerTitleStyle: {
            fontWeight: '500',
            fontSize: 17,
            textColor: themeColors.text,
        },
        headerLeft: () => (  
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              margin: -3,
              width: 44,
              height: 44,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Icon 
              name={'chevron-back'} 
              fontType={Font.Ionicons}
              size={24} 
              color={themeColors.text } 
            />
          </TouchableOpacity>
        ),
    });
  }, [navigation, title, themeColors]);

  const _renderProgressView = (
    progress < 1 && (
      <ThemedView style={{ position: 'absolute', zIndex: 1000, width: kW, height: 2, backgroundColor: '#fff'}}>
        <ThemedView style={{ width: kW * progress, height: 2, backgroundColor: 'blue' }} />
      </ThemedView>
    )
  );

  return (
    <ThemedView style={{ flex: 1, backgroundColor: themeColors.background }}>
      { _renderProgressView }
      <WebView style={{ flex: 1 }} source={{ uri: url }} onLoadProgress={(e) => {
        //console.log('>>>', e.nativeEvent.progress);
        const progress = e.nativeEvent.progress;
        setProgress(progress)
      }} />
    </ThemedView>
  );
}