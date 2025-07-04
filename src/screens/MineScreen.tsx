import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import I18n from '@/utils/i18n';

const HEADER_HEIGHT = 200;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MineScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const scrollY = useRef(new Animated.Value(0)).current;

  // 下拉时header变高，上滑时header整体往上推
  const headerHeight = scrollY.interpolate({
    inputRange: [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
    outputRange: [HEADER_HEIGHT * 2, HEADER_HEIGHT, HEADER_HEIGHT],
    extrapolate: 'clamp',
  });
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  const renderListItem = (icon: string, title: string, onPress: () => void) => (
    <TouchableOpacity style={styles.listItem} onPress={onPress}>
      <Icon name={icon} size={24} color="#333" />
      <Text style={styles.listItemText}>{title}</Text>
      <Icon name="chevron-forward" size={24} color="#999" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.header,
          { height: headerHeight, transform: [{ translateY: headerTranslateY }] }
        ]}
      >
        <Image
          source={{ uri: 'https://picsum.photos/800/400' }}
          style={styles.headerBackground}
          resizeMode="cover"
        />
        <TouchableOpacity activeOpacity={0.8} style={styles.headerContent} onPress={() => navigation.navigate('Profile')}>
          <Image
            source={{ uri: 'https://picsum.photos/200' }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.username}>用户名</Text>
            <Text style={styles.userBio}>个人简介</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          // useNativeDriver: true 时，Animated 只支持 transform、opacity 等有限的属性，不支持 height、width、backgroundColor 等布局属性的动画。
          // 而我们现在用 Animated 控制了 header 的 height，这在 useNativeDriver 为 true 时是不被支持的。
          { useNativeDriver: false }
        )}
        bounces={true}
        overScrollMode="always"
      >
        <View style={styles.listContainer}>
          {/* {renderListItem('happy-outline', '我的宝宝', () => {})}
          {renderListItem('cart-outline', '我的商城', () => {})}
          {renderListItem('chatbubble-outline', '意见反馈', () => {})}
          {renderListItem('help-circle-outline', '帮助中心', () => {})}
          {renderListItem('share-social-outline', '分享应用', () => {})}
          {renderListItem('information-circle-outline', '关于我们', () => {})} */}
          {renderListItem('settings-outline', I18n.t('settings'), () => {
            navigation.navigate('Settings');
          })}
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    overflow: 'hidden',
    zIndex: 1,
  },
  headerBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  headerContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#fff',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  userBio: {
    fontSize: 14,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: HEADER_HEIGHT,
  },
  listContainer: {
    backgroundColor: '#fff',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  listItemText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
});

export default MineScreen; 