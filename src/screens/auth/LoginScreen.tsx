import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import type { NativeStackScreenProps } from '@react-navigation/native-stack'; // 不再需要
// import { AuthStackParamList } from '@/navigation/types'; // 不再需要
import { useDispatch } from 'react-redux';
import { setAuthentication } from '@/store/authSlice'; // 导入 setAuthentication action
import i18n from '@/utils/i18n';
import { ThemedText } from '@/components/ui/ThemedText';

// type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>; // 不再需要

const LoginScreen = () => {
  const dispatch = useDispatch(); // 获取 dispatch 函数

  const handleLogin = () => {
    // 这里可以添加实际的登录逻辑
    dispatch(setAuthentication(true)); // 派发 action 更新认证状态
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.text}>{i18n.t('login')}</ThemedText>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>{i18n.t('login')}</Text>
      </TouchableOpacity>
    </View>
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
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default LoginScreen; 