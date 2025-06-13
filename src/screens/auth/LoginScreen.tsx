import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import type { NativeStackScreenProps } from '@react-navigation/native-stack'; // 不再需要
// import { AuthStackParamList } from '@/navigation/types'; // 不再需要
import { useDispatch } from 'react-redux';
import { setAuthentication } from '@/store/authSlice'; // 导入 setAuthentication action

// type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>; // 不再需要

const LoginScreen = () => {
  const dispatch = useDispatch(); // 获取 dispatch 函数

  const handleLogin = () => {
    // 这里可以添加实际的登录逻辑
    dispatch(setAuthentication(true)); // 派发 action 更新认证状态
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>登录</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>登录</Text>
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
    backgroundColor: '#007AFF',
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