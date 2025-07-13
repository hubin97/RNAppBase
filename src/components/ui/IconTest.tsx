import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from './Icon';

/**
 * 图标测试组件
 * 用于验证所有字体图集在 iOS 和 Android 上是否正常显示
 */
const IconTest: React.FC = () => {
  const testIcons = [
    { name: 'home', description: '首页' },
    { name: 'heart', description: '喜欢' },
    { name: 'star', description: '星星' },
    { name: 'settings', description: '设置' },
    { name: 'chevron-back', description: '返回 (iOS)' },
    { name: 'arrow-back', description: '返回 (Android)' },
    { name: 'search', description: '搜索' },
    { name: 'person', description: '用户' },
    { name: 'notifications', description: '通知' },
    { name: 'menu', description: '菜单' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>图标字体测试</Text>
      <Text style={styles.subtitle}>验证所有字体图集在 iOS 和 Android 上的显示效果</Text>
      
      <View style={styles.iconGrid}>
        {testIcons.map((icon, index) => (
          <View key={index} style={styles.iconItem}>
            <Icon 
              name={icon.name} 
              size={32} 
              color="#007AFF" 
            />
            <Text style={styles.iconName}>{icon.name}</Text>
            <Text style={styles.iconDescription}>{icon.description}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>不同尺寸测试</Text>
        <View style={styles.sizeRow}>
          <View style={styles.sizeItem}>
            <Icon name="home" size={16} color="#FF3B30" />
            <Text style={styles.sizeText}>16px</Text>
          </View>
          <View style={styles.sizeItem}>
            <Icon name="home" size={24} color="#FF9500" />
            <Text style={styles.sizeText}>24px</Text>
          </View>
          <View style={styles.sizeItem}>
            <Icon name="home" size={32} color="#34C759" />
            <Text style={styles.sizeText}>32px</Text>
          </View>
          <View style={styles.sizeItem}>
            <Icon name="home" size={48} color="#5856D6" />
            <Text style={styles.sizeText}>48px</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>不同颜色测试</Text>
        <View style={styles.colorRow}>
          <Icon name="heart" size={32} color="#FF3B30" />
          <Icon name="heart" size={32} color="#FF9500" />
          <Icon name="heart" size={32} color="#34C759" />
          <Icon name="heart" size={32} color="#007AFF" />
          <Icon name="heart" size={32} color="#5856D6" />
          <Icon name="heart" size={32} color="#FF2D92" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>其他字体图集测试</Text>
        <View style={styles.fontRow}>
          <View style={styles.fontItem}>
            <Text style={styles.fontLabel}>MaterialIcons</Text>
            <Icon name="home" fontType="MaterialIcons" size={24} color="#007AFF" />
          </View>
          <View style={styles.fontItem}>
            <Text style={styles.fontLabel}>FontAwesome</Text>
            <Icon name="home" fontType="FontAwesome" size={24} color="#FF3B30" />
          </View>
          <View style={styles.fontItem}>
            <Text style={styles.fontLabel}>AntDesign</Text>
            <Icon name="home" fontType="AntDesign" size={24} color="#34C759" />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>平台特定图标测试</Text>
        <View style={styles.platformRow}>
          <View style={styles.platformItem}>
            <Text style={styles.platformLabel}>iOS 返回</Text>
            <Icon name="chevron-back" size={32} color="#007AFF" />
          </View>
          <View style={styles.platformItem}>
            <Text style={styles.platformLabel}>Android 返回</Text>
            <Icon name="arrow-back" size={32} color="#007AFF" />
          </View>
        </View>
      </View>

      <Text style={styles.note}>
        💡 如果所有图标都正常显示，说明配置成功！
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F2F2F7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  iconItem: {
    width: '30%',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconName: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    color: '#333',
    textAlign: 'center',
  },
  iconDescription: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  sizeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  sizeItem: {
    alignItems: 'center',
  },
  sizeText: {
    fontSize: 12,
    marginTop: 8,
    color: '#666',
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  fontRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  fontItem: {
    alignItems: 'center',
  },
  fontLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
  platformRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  platformItem: {
    alignItems: 'center',
  },
  platformLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
  note: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    color: '#1976D2',
  },
});

export default IconTest; 