/**
 * Stack Navigator 通用工具（固定工具类 - 可复用）
 * 
 * 此文件包含通用的 Stack Navigator 创建工具
 * 不依赖项目特定的业务逻辑，可以在其他项目中直接复用
 * 
 * 注意：此文件是固定的工具类，一般不需要修改
 */
import React, { createContext, useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { StackConfig, ScreenOptionContext } from './types';

// Context 用于传递运行时数据（如 dispatch）
const StackContext = createContext<ScreenOptionContext | undefined>(undefined);

type CreateStackNavigatorOptions<ParamList> = {
  config: StackConfig;
  // 创建导航选项的函数（由项目适配层提供）
  createNavigatorOptions: (params: any) => any;
};

/**
 * 创建 Stack Navigator 组件
 * 
 * @template ParamList - 导航参数列表类型
 */
export function createStackNavigator<ParamList extends Record<string, any>>(
  options: CreateStackNavigatorOptions<ParamList>
) {
  const { config, createNavigatorOptions } = options;
  const Stack = createNativeStackNavigator<ParamList>();

  return function StackNavigator(props?: { context?: ScreenOptionContext }) {
    const context = useContext(StackContext) || props?.context;
    const screenOptions = config.screenOptions
      ? createNavigatorOptions(config.screenOptions)
      : undefined;

    const content = (
      <Stack.Navigator screenOptions={screenOptions}>
        {config.screens.map((screen) => {
          const baseOptions = screen.options
            ? createNavigatorOptions(screen.options)
            : {};
          const extraOptions = screen.extraOptions
            ? screen.extraOptions(context)
            : {};

          return (
            <Stack.Screen
              key={screen.name}
              name={screen.name as keyof ParamList}
              component={screen.component}
              options={{
                ...baseOptions,
                ...extraOptions,
              }}
            />
          );
        })}
      </Stack.Navigator>
    );

    // 如果有 context，通过 Context Provider 传递
    if (props?.context) {
      return <StackContext.Provider value={props.context}>{content}</StackContext.Provider>;
    }

    return content;
  };
}
