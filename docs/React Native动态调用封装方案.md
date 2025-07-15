# React Native 动态调用封装方案

## 📋 目录

- [概述](#概述)
- [设计思路](#设计思路)
- [统一数据结构](#统一数据结构)
- [实现方案](#实现方案)
- [使用示例](#使用示例)
- [优势分析](#优势分析)
- [最佳实践](#最佳实践)
- [注意事项](#注意事项)

---

## 🎯 概述

### 什么是动态调用封装？

动态调用封装是一种基于统一数据结构的原生模块调用方案，通过约定标准的数据格式，实现类似反射机制的动态方法调用。这种方式可以大大简化原生模块的开发，提高代码复用性和维护性。

### 核心思想

- **统一数据结构** - 约定标准的调用格式
- **动态解析** - 通过 method 字段动态映射方法
- **灵活参数** - 支持可选参数和回调
- **类型安全** - 保持 TypeScript 类型检查

---

## 💡 设计思路

### 传统方式的问题

**传统原生模块开发：**

```tsx
// 每个功能都需要单独定义模块
const CameraModule = TurboModuleRegistry.get('CameraModule');
const FileModule = TurboModuleRegistry.get('FileModule');
const NetworkModule = TurboModuleRegistry.get('NetworkModule');

// 调用方式
await CameraModule.takePhoto();
await FileModule.readFile(path);
await NetworkModule.fetch(url);
```

**问题：**

- 需要为每个功能创建独立的原生模块
- 代码重复，维护成本高
- 模块间缺乏统一性

### 动态调用方案

**统一调用方式：**

```tsx
// 使用统一的动态调用接口
const result = await NativeInvoker.invoke({
  method: 'camera.takePhoto',
  params: { quality: 'high' },
  callback: 'onPhotoTaken'
});
```

**优势：**

- 一套接口处理所有业务场景
- 减少原生模块数量
- 统一的错误处理和参数验证

---

## 📊 统一数据结构

### 标准调用格式

```tsx
interface NativeCallRequest {
  method: string;           // 方法名，支持点号分隔的命名空间
  params?: Record<string, any>;  // 可选参数
  callback?: string;        // 可选回调函数名
}

interface NativeCallResponse {
  success: boolean;         // 调用是否成功
  data?: any;              // 返回数据
  error?: string;          // 错误信息
}
```

### 方法命名规范

```tsx
// 命名空间.功能.操作
const methodExamples = {
  // 相机相关
  'camera.takePhoto': '拍照',
  'camera.recordVideo': '录制视频',
  'camera.switchCamera': '切换摄像头',
  
  // 文件相关
  'file.readFile': '读取文件',
  'file.writeFile': '写入文件',
  'file.deleteFile': '删除文件',
  
  // 网络相关
  'network.fetch': '网络请求',
  'network.upload': '文件上传',
  'network.download': '文件下载',
  
  // 设备相关
  'device.getInfo': '获取设备信息',
  'device.getBattery': '获取电池信息',
  'device.getLocation': '获取位置信息',
};
```

---

## 🔧 实现方案

### 1. JavaScript 端封装

```tsx
// src/utils/NativeInvoker.ts
import { TurboModuleRegistry } from 'react-native';

interface NativeInvokerSpec extends TurboModule {
  invoke(request: NativeCallRequest): Promise<NativeCallResponse>;
}

class NativeInvoker {
  private static instance: NativeInvokerSpec | null = null;
  
  private static getInstance(): NativeInvokerSpec {
    if (!this.instance) {
      this.instance = TurboModuleRegistry.getEnforcing<NativeInvokerSpec>('NativeInvoker');
    }
    return this.instance;
  }
  
  static async invoke(request: NativeCallRequest): Promise<any> {
    try {
      const response = await this.getInstance().invoke(request);
  
      if (!response.success) {
        throw new Error(response.error || '调用失败');
      }
  
      return response.data;
    } catch (error) {
      throw new Error(`原生调用失败: ${error.message}`);
    }
  }
  
  // 便捷方法
  static async call(method: string, params?: Record<string, any>): Promise<any> {
    return this.invoke({ method, params });
  }
  
  static async callWithCallback(
    method: string, 
    params?: Record<string, any>, 
    callback?: string
  ): Promise<any> {
    return this.invoke({ method, params, callback });
  }
}

export default NativeInvoker;
```

### 2. iOS 端实现

```objc
// NativeInvoker.h
@interface NativeInvoker : RCTTurboModule

+ (void)registerMethod:(NSString *)methodName 
                target:(id)target 
              selector:(SEL)selector;

@end

// NativeInvoker.m
@implementation NativeInvoker {
    NSMutableDictionary *_methodRegistry;
}

RCT_EXPORT_METHOD(invoke:(NSDictionary *)request
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    NSString *method = request[@"method"];
    NSDictionary *params = request[@"params"];
    NSString *callback = request[@"callback"];
  
    // 查找注册的方法
    NSDictionary *methodInfo = _methodRegistry[method];
    if (!methodInfo) {
        reject(@"METHOD_NOT_FOUND", [NSString stringWithFormat:@"方法 %@ 未找到", method], nil);
        return;
    }
  
    id target = methodInfo[@"target"];
    SEL selector = NSSelectorFromString(methodInfo[@"selector"]);
  
    // 动态调用
    @try {
        if ([target respondsToSelector:selector]) {
            NSMethodSignature *signature = [target methodSignatureForSelector:selector];
            NSInvocation *invocation = [NSInvocation invocationWithMethodSignature:signature];
        
            [invocation setTarget:target];
            [invocation setSelector:selector];
        
            // 设置参数
            if (params) {
                [invocation setArgument:&params atIndex:2];
            }
        
            [invocation invoke];
        
            // 获取返回值
            id returnValue = nil;
            if (signature.methodReturnLength > 0) {
                [invocation getReturnValue:&returnValue];
            }
        
            resolve(@{
                @"success": @YES,
                @"data": returnValue ?: [NSNull null]
            });
        } else {
            reject(@"METHOD_NOT_IMPLEMENTED", @"方法未实现", nil);
        }
    } @catch (NSException *exception) {
        reject(@"INVOCATION_ERROR", exception.reason, nil);
    }
}

// 注册方法
+ (void)registerMethod:(NSString *)methodName 
                target:(id)target 
              selector:(SEL)selector
{
    if (!_methodRegistry) {
        _methodRegistry = [NSMutableDictionary dictionary];
    }
  
    _methodRegistry[methodName] = @{
        @"target": target,
        @"selector": NSStringFromSelector(selector)
    };
}

@end
```

### 3. Android 端实现

```java
// NativeInvoker.java
@ReactModule(name = "NativeInvoker")
public class NativeInvoker extends TurboModule {
    private static final Map<String, MethodInfo> methodRegistry = new HashMap<>();
  
    @ReactMethod
    public void invoke(ReadableMap request, Promise promise) {
        try {
            String method = request.getString("method");
            ReadableMap params = request.hasKey("params") ? request.getMap("params") : null;
            String callback = request.hasKey("callback") ? request.getString("callback") : null;
        
            // 查找注册的方法
            MethodInfo methodInfo = methodRegistry.get(method);
            if (methodInfo == null) {
                promise.reject("METHOD_NOT_FOUND", "方法 " + method + " 未找到");
                return;
            }
        
            // 动态调用
            Object result = methodInfo.invoke(params);
        
            WritableMap response = Arguments.createMap();
            response.putBoolean("success", true);
            response.putMap("data", result != null ? Arguments.fromMap((Map) result) : null);
        
            promise.resolve(response);
        
        } catch (Exception e) {
            WritableMap response = Arguments.createMap();
            response.putBoolean("success", false);
            response.putString("error", e.getMessage());
            promise.resolve(response);
        }
    }
  
    // 注册方法
    public static void registerMethod(String methodName, Object target, String methodName) {
        methodRegistry.put(methodName, new MethodInfo(target, methodName));
    }
  
    private static class MethodInfo {
        private final Object target;
        private final String methodName;
    
        public MethodInfo(Object target, String methodName) {
            this.target = target;
            this.methodName = methodName;
        }
    
        public Object invoke(ReadableMap params) throws Exception {
            // 使用反射调用方法
            Method method = target.getClass().getMethod(methodName, ReadableMap.class);
            return method.invoke(target, params);
        }
    }
}
```

---

## 💻 使用示例

### 1. 基础调用

```tsx
// 简单调用
const deviceInfo = await NativeInvoker.call('device.getInfo');

// 带参数调用
const photoPath = await NativeInvoker.call('camera.takePhoto', {
  quality: 'high',
  flash: 'auto'
});

// 带回调调用
const result = await NativeInvoker.callWithCallback(
  'file.upload',
  { path: '/path/to/file' },
  'onUploadProgress'
);
```

### 2. 业务场景封装

```tsx
// src/services/CameraService.ts
export class CameraService {
  static async takePhoto(options: {
    quality?: 'low' | 'medium' | 'high';
    flash?: 'auto' | 'on' | 'off';
  } = {}) {
    return NativeInvoker.call('camera.takePhoto', options);
  }
  
  static async recordVideo(options: {
    duration?: number;
    quality?: 'low' | 'medium' | 'high';
  } = {}) {
    return NativeInvoker.call('camera.recordVideo', options);
  }
  
  static async switchCamera() {
    return NativeInvoker.call('camera.switchCamera');
  }
}

// src/services/FileService.ts
export class FileService {
  static async readFile(path: string, encoding: string = 'utf8') {
    return NativeInvoker.call('file.readFile', { path, encoding });
  }
  
  static async writeFile(path: string, content: string) {
    return NativeInvoker.call('file.writeFile', { path, content });
  }
  
  static async deleteFile(path: string) {
    return NativeInvoker.call('file.deleteFile', { path });
  }
}
```

### 3. 组件中使用

```tsx
// src/components/CameraComponent.tsx
import React, { useState } from 'react';
import { View, Button, Image } from 'react-native';
import { CameraService } from '../services/CameraService';

const CameraComponent = () => {
  const [photoPath, setPhotoPath] = useState<string | null>(null);
  
  const handleTakePhoto = async () => {
    try {
      const path = await CameraService.takePhoto({
        quality: 'high',
        flash: 'auto'
      });
      setPhotoPath(path);
    } catch (error) {
      console.error('拍照失败:', error);
    }
  };
  
  return (
    <View>
      <Button title="拍照" onPress={handleTakePhoto} />
      {photoPath && <Image source={{ uri: photoPath }} />}
    </View>
  );
};
```

### 4. JS 调用原生方法详解

#### 4.1 基础调用流程

```tsx
// JS 端调用
const handleTakePhoto = async () => {
  try {
    // 1. 调用原生方法
    const result = await NativeInvoker.call('camera.takePhoto', {
      quality: 'high',
      flash: 'auto'
    });
  
    console.log('拍照成功:', result);
    // result: "/path/to/photo.jpg"
  
  } catch (error) {
    console.error('拍照失败:', error);
  }
};
```

**调用流程：**

1. **JS 发起调用** → `NativeInvoker.call('camera.takePhoto', params)`
2. **参数序列化** → 将 JS 对象转换为原生可识别的格式
3. **原生接收** → iOS/Android 接收调用请求
4. **方法查找** → 在注册表中查找 `camera.takePhoto` 方法
5. **动态调用** → 使用反射机制调用对应的原生方法
6. **结果返回** → 将原生结果返回给 JS

#### 4.2 带回调的调用

```tsx
// JS 端定义回调函数
const onUploadProgress = (progress: number) => {
  console.log('上传进度:', progress);
};

// JS 端调用带回调的方法
const handleUpload = async () => {
  try {
    const result = await NativeInvoker.callWithCallback(
      'file.upload',
      { 
        path: '/path/to/file',
        url: 'https://api.example.com/upload'
      },
      'onUploadProgress'  // 回调函数名
    );
  
    console.log('上传完成:', result);
  } catch (error) {
    console.error('上传失败:', error);
  }
};
```

**回调处理流程：**

1. **JS 调用** → 传入回调函数名
2. **原生执行** → 原生方法执行过程中调用 JS 回调
3. **进度通知** → 原生通过事件发送进度信息
4. **JS 接收** → JS 端接收并处理进度回调

### 5. 原生调用 JS 方法详解

#### 5.1 原生主动调用 JS

```objc
// iOS 原生端调用 JS
- (void)notifyJSWithData:(NSDictionary *)data {
    // 1. 获取 JS 模块
    RCTBridge *bridge = [self.bridge valueForKey:@"parentBridge"];
  
    // 2. 调用 JS 方法
    [bridge.eventDispatcher sendAppEventWithName:@"onDataReceived" 
                                           body:data];
}

// 在原生方法中使用
- (NSString *)processData:(NSDictionary *)params {
    // 处理数据
    NSDictionary *result = @{@"status": @"success", @"data": @"processed"};
  
    // 通知 JS
    [self notifyJSWithData:result];
  
    return @"处理完成";
}
```

```java
// Android 原生端调用 JS
public void notifyJSWithData(Map<String, Object> data) {
    // 1. 获取 ReactContext
    ReactContext reactContext = getReactApplicationContext();
  
    // 2. 发送事件到 JS
    reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit("onDataReceived", Arguments.fromMap(data));
}

// 在原生方法中使用
public String processData(ReadableMap params) {
    // 处理数据
    Map<String, Object> result = new HashMap<>();
    result.put("status", "success");
    result.put("data", "processed");
  
    // 通知 JS
    notifyJSWithData(result);
  
    return "处理完成";
}
```

#### 5.2 JS 端被调用处理

```tsx
// JS 端监听原生事件
import { DeviceEventEmitter } from 'react-native';

// 1. 全局事件监听器
class JSEventHandler {
  private static listeners = new Map();
  
  // 注册事件监听器
  static addListener(eventName: string, handler: Function) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName).push(handler);
  }
  
  // 移除事件监听器
  static removeListener(eventName: string, handler: Function) {
    const handlers = this.listeners.get(eventName);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }
  
  // 处理原生调用
  static handleNativeCall(eventName: string, data: any) {
    console.log(`JS 收到原生调用: ${eventName}`, data);
  
    const handlers = this.listeners.get(eventName);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`处理事件 ${eventName} 失败:`, error);
        }
      });
    }
  }
}

// 2. 初始化事件监听
const initializeJSEventHandlers = () => {
  // 监听原生事件
  DeviceEventEmitter.addListener('onDataReceived', (data) => {
    JSEventHandler.handleNativeCall('onDataReceived', data);
  });
  
  DeviceEventEmitter.addListener('uploadProgress', (data) => {
    JSEventHandler.handleNativeCall('uploadProgress', data);
  });
  
  DeviceEventEmitter.addListener('dataUpdated', (data) => {
    JSEventHandler.handleNativeCall('dataUpdated', data);
  });
  
  DeviceEventEmitter.addListener('nativeError', (data) => {
    JSEventHandler.handleNativeCall('nativeError', data);
  });
};

// 3. 在应用启动时初始化
initializeJSEventHandlers();

// 4. 在组件中使用
const useNativeEvents = () => {
  useEffect(() => {
    // 注册事件处理函数
    const handleDataReceived = (data: any) => {
      console.log('收到原生数据:', data);
      // 处理数据逻辑
    };
  
    const handleUploadProgress = (data: any) => {
      console.log('上传进度:', data.progress);
      // 更新进度逻辑
    };
  
    const handleError = (data: any) => {
      console.error('原生错误:', data);
      // 错误处理逻辑
    };
  
    // 添加监听器
    JSEventHandler.addListener('onDataReceived', handleDataReceived);
    JSEventHandler.addListener('uploadProgress', handleUploadProgress);
    JSEventHandler.addListener('nativeError', handleError);
  
    // 清理监听器
    return () => {
      JSEventHandler.removeListener('onDataReceived', handleDataReceived);
      JSEventHandler.removeListener('uploadProgress', handleUploadProgress);
      JSEventHandler.removeListener('nativeError', handleError);
    };
  }, []);
};

// 5. 在组件中使用
const MyComponent = () => {
  useNativeEvents();
  
  return <View>{/* 组件内容 */}</View>;
};
```

### 6. 原生被调用处理详解

#### 6.1 方法解析和调用流程

**当 JS 调用 `NativeInvoker.call('camera.takePhoto', { quality: 'high' })` 时：**

```objc
// iOS 原生端 - 方法解析示例
// 1. JS 调用到达 invoke 方法
RCT_EXPORT_METHOD(invoke:(NSDictionary *)request
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    // 2. 解析调用参数
    NSString *method = request[@"method"];  // "camera.takePhoto"
    NSDictionary *params = request[@"params"];  // { "quality": "high" }
  
    // 3. 从注册表中查找方法信息
    NSDictionary *methodInfo = _methodRegistry[method];
    // methodInfo = {
    //   "target": cameraModule,
    //   "selector": "takePhoto:"
    // }
  
    // 4. 获取目标对象和方法选择器
    id target = methodInfo[@"target"];  // CameraModule 实例
    SEL selector = NSSelectorFromString(methodInfo[@"selector"]);  // @selector(takePhoto:)
  
    // 5. 动态调用业务方法
    if ([target respondsToSelector:selector]) {
        // 调用 CameraModule 的 takePhoto: 方法
        NSString *result = [target performSelector:selector withObject:params];
        resolve(@{ @"success": @YES, @"data": result });
    }
}
```

```java
// Android 原生端 - 方法解析示例
@ReactMethod
public void invoke(ReadableMap request, Promise promise) {
    // 1. JS 调用到达 invoke 方法
    String method = request.getString("method");  // "camera.takePhoto"
    ReadableMap params = request.getMap("params");  // { "quality": "high" }
  
    // 2. 从注册表中查找方法信息
    MethodInfo methodInfo = methodRegistry.get(method);
    // methodInfo = {
    //   target: cameraModule,
    //   methodName: "takePhoto"
    // }
  
    // 3. 动态调用业务方法
    Object result = methodInfo.invoke(params);
    // 实际调用: cameraModule.takePhoto(params)
  
    // 4. 返回结果
    WritableMap response = Arguments.createMap();
    response.putBoolean("success", true);
    response.putString("data", (String) result);
    promise.resolve(response);
}
```

#### 6.2 具体业务方法调用示例

**示例：调用相机拍照功能**

```objc
// iOS - CameraModule.m
@implementation CameraModule

// 业务方法：拍照
- (NSString *)takePhoto:(NSDictionary *)params {
    // 1. 解析参数
    NSString *quality = params[@"quality"] ?: @"high";
    NSString *flash = params[@"flash"] ?: @"auto";
  
    NSLog(@"开始拍照 - 质量: %@, 闪光灯: %@", quality, flash);
  
    // 2. 执行业务逻辑
    // 这里实现实际的拍照逻辑
    NSString *photoPath = [self capturePhotoWithQuality:quality flash:flash];
  
    // 3. 返回结果
    return photoPath;
}

// 业务方法：录制视频
- (NSString *)recordVideo:(NSDictionary *)params {
    NSNumber *duration = params[@"duration"] ?: @30;
    NSString *quality = params[@"quality"] ?: @"high";
  
    NSLog(@"开始录制视频 - 时长: %@秒, 质量: %@", duration, quality);
  
    // 实现录制逻辑
    NSString *videoPath = [self startRecordingWithDuration:duration quality:quality];
  
    return videoPath;
}

// 业务方法：切换摄像头
- (void)switchCamera:(NSDictionary *)params {
    NSLog(@"切换摄像头");
  
    // 实现切换逻辑
    [self toggleCamera];
}

@end
```

```java
// Android - CameraModule.java
public class CameraModule {
  
    // 业务方法：拍照
    public String takePhoto(ReadableMap params) {
        // 1. 解析参数
        String quality = params.hasKey("quality") ? params.getString("quality") : "high";
        String flash = params.hasKey("flash") ? params.getString("flash") : "auto";
      
        Log.d("CameraModule", "开始拍照 - 质量: " + quality + ", 闪光灯: " + flash);
      
        // 2. 执行业务逻辑
        // 这里实现实际的拍照逻辑
        String photoPath = capturePhoto(quality, flash);
      
        // 3. 返回结果
        return photoPath;
    }
  
    // 业务方法：录制视频
    public String recordVideo(ReadableMap params) {
        int duration = params.hasKey("duration") ? params.getInt("duration") : 30;
        String quality = params.hasKey("quality") ? params.getString("quality") : "high";
      
        Log.d("CameraModule", "开始录制视频 - 时长: " + duration + "秒, 质量: " + quality);
      
        // 实现录制逻辑
        String videoPath = startRecording(duration, quality);
      
        return videoPath;
    }
  
    // 业务方法：切换摄像头
    public void switchCamera(ReadableMap params) {
        Log.d("CameraModule", "切换摄像头");
      
        // 实现切换逻辑
        toggleCamera();
    }
}
```

#### 6.3 文件操作业务方法示例

```objc
// iOS - FileModule.m
@implementation FileModule

// 业务方法：读取文件
- (NSString *)readFile:(NSDictionary *)params {
    NSString *path = params[@"path"];
    NSString *encoding = params[@"encoding"] ?: @"utf8";
  
    NSLog(@"读取文件: %@, 编码: %@", path, encoding);
  
    // 实现文件读取逻辑
    NSError *error;
    NSString *content = [NSString stringWithContentsOfFile:path 
                                                  encoding:NSUTF8StringEncoding 
                                                     error:&error];
  
    if (error) {
        NSLog(@"读取文件失败: %@", error.localizedDescription);
        return nil;
    }
  
    return content;
}

// 业务方法：写入文件
- (BOOL)writeFile:(NSDictionary *)params {
    NSString *path = params[@"path"];
    NSString *content = params[@"content"];
  
    NSLog(@"写入文件: %@", path);
  
    // 实现文件写入逻辑
    NSError *error;
    BOOL success = [content writeToFile:path 
                              atomically:YES 
                                encoding:NSUTF8StringEncoding 
                                   error:&error];
  
    if (!success) {
        NSLog(@"写入文件失败: %@", error.localizedDescription);
    }
  
    return success;
}

// 业务方法：删除文件
- (BOOL)deleteFile:(NSDictionary *)params {
    NSString *path = params[@"path"];
  
    NSLog(@"删除文件: %@", path);
  
    // 实现文件删除逻辑
    NSFileManager *fileManager = [NSFileManager defaultManager];
    NSError *error;
    BOOL success = [fileManager removeItemAtPath:path error:&error];
  
    if (!success) {
        NSLog(@"删除文件失败: %@", error.localizedDescription);
    }
  
    return success;
}

@end
```

```java
// Android - FileModule.java
public class FileModule {
  
    // 业务方法：读取文件
    public String readFile(ReadableMap params) {
        String path = params.getString("path");
        String encoding = params.hasKey("encoding") ? params.getString("encoding") : "utf8";
      
        Log.d("FileModule", "读取文件: " + path + ", 编码: " + encoding);
      
        try {
            // 实现文件读取逻辑
            File file = new File(path);
            if (!file.exists()) {
                Log.e("FileModule", "文件不存在: " + path);
                return null;
            }
          
            byte[] bytes = Files.readAllBytes(file.toPath());
            return new String(bytes, encoding);
          
        } catch (IOException e) {
            Log.e("FileModule", "读取文件失败: " + e.getMessage());
            return null;
        }
    }
  
    // 业务方法：写入文件
    public boolean writeFile(ReadableMap params) {
        String path = params.getString("path");
        String content = params.getString("content");
      
        Log.d("FileModule", "写入文件: " + path);
      
        try {
            // 实现文件写入逻辑
            File file = new File(path);
            Files.write(file.toPath(), content.getBytes());
            return true;
          
        } catch (IOException e) {
            Log.e("FileModule", "写入文件失败: " + e.getMessage());
            return false;
        }
    }
  
    // 业务方法：删除文件
    public boolean deleteFile(ReadableMap params) {
        String path = params.getString("path");
      
        Log.d("FileModule", "删除文件: " + path);
      
        try {
            // 实现文件删除逻辑
            File file = new File(path);
            return file.delete();
          
        } catch (Exception e) {
            Log.e("FileModule", "删除文件失败: " + e.getMessage());
            return false;
        }
    }
}
```

#### 6.4 方法注册和映射关系

```objc
// iOS - 方法注册示例
- (void)registerCameraMethods {
    CameraModule *cameraModule = [[CameraModule alloc] init];
  
    // 注册方法映射关系
    [NativeInvoker registerMethod:@"camera.takePhoto" 
                          target:cameraModule 
                        selector:@selector(takePhoto:)];
  
    [NativeInvoker registerMethod:@"camera.recordVideo" 
                          target:cameraModule 
                        selector:@selector(recordVideo:)];
  
    [NativeInvoker registerMethod:@"camera.switchCamera" 
                          target:cameraModule 
                        selector:@selector(switchCamera:)];
}

- (void)registerFileMethods {
    FileModule *fileModule = [[FileModule alloc] init];
  
    [NativeInvoker registerMethod:@"file.readFile" 
                          target:fileModule 
                        selector:@selector(readFile:)];
  
    [NativeInvoker registerMethod:@"file.writeFile" 
                          target:fileModule 
                        selector:@selector(writeFile:)];
  
    [NativeInvoker registerMethod:@"file.deleteFile" 
                          target:fileModule 
                        selector:@selector(deleteFile:)];
}
```

```java
// Android - 方法注册示例
private void registerCameraMethods() {
    CameraModule cameraModule = new CameraModule();
  
    // 注册方法映射关系
    NativeInvoker.registerMethod("camera.takePhoto", cameraModule, "takePhoto");
    NativeInvoker.registerMethod("camera.recordVideo", cameraModule, "recordVideo");
    NativeInvoker.registerMethod("camera.switchCamera", cameraModule, "switchCamera");
}

private void registerFileMethods() {
    FileModule fileModule = new FileModule();
  
    NativeInvoker.registerMethod("file.readFile", fileModule, "readFile");
    NativeInvoker.registerMethod("file.writeFile", fileModule, "writeFile");
    NativeInvoker.registerMethod("file.deleteFile", fileModule, "deleteFile");
}
```

#### 6.5 调用流程总结

**完整的调用链路：**

1. **JS 调用** → `NativeInvoker.call('camera.takePhoto', { quality: 'high' })`
2. **参数传递** → JS 对象转换为原生可识别的格式
3. **方法解析** → 从注册表中查找 `camera.takePhoto` 对应的目标对象和方法
4. **动态调用** → 调用 `CameraModule.takePhoto(params)` 方法
5. **业务执行** → 执行实际的拍照逻辑
6. **结果返回** → 将拍照结果返回给 JS

**关键点：**

- **方法映射** - 通过注册表建立 JS 方法名与原生方法的映射关系
- **参数解析** - 将 JS 参数转换为原生方法可接受的格式
- **动态调用** - 使用反射机制调用具体的业务方法
- **结果处理** - 将原生方法的返回值转换为 JS 可识别的格式

### 7. 双向通信完整示例

#### 7.1 文件上传进度监控

```tsx
// JS 端实现
const FileUploadComponent = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle');
  
  useEffect(() => {
    // 监听上传进度
    const progressSubscription = DeviceEventEmitter.addListener(
      'uploadProgress',
      (data) => {
        setProgress(data.progress);
        setStatus(data.status);
      }
    );
  
    return () => progressSubscription.remove();
  }, []);
  
  const handleUpload = async () => {
    try {
      setStatus('uploading');
    
      // 调用原生上传方法
      const result = await NativeInvoker.call('file.upload', {
        path: '/path/to/file',
        url: 'https://api.example.com/upload'
      });
    
      setStatus('completed');
      console.log('上传完成:', result);
    
    } catch (error) {
      setStatus('error');
      console.error('上传失败:', error);
    }
  };
  
  return (
    <View>
      <Button title="上传文件" onPress={handleUpload} />
      <Text>状态: {status}</Text>
      <Text>进度: {progress}%</Text>
    </View>
  );
};
```

```objc
// iOS 原生端实现
- (NSString *)uploadFile:(NSDictionary *)params {
    NSString *filePath = params[@"path"];
    NSString *uploadUrl = params[@"url"];
  
    // 1. 开始上传
    [self notifyJSWithEvent:@"uploadProgress" data:@{
        @"progress": @0,
        @"status": @"started"
    }];
  
    // 2. 模拟上传进度
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        for (int i = 0; i <= 100; i += 10) {
            [NSThread sleepForTimeInterval:0.1];
          
            [self notifyJSWithEvent:@"uploadProgress" data:@{
                @"progress": @(i),
                @"status": @"uploading"
            }];
        }
      
        // 3. 上传完成
        [self notifyJSWithEvent:@"uploadProgress" data:@{
            @"progress": @100,
            @"status": @"completed"
        }];
    });
  
    return @"上传任务已启动";
}

- (void)notifyJSWithEvent:(NSString *)eventName data:(NSDictionary *)data {
    RCTBridge *bridge = [self.bridge valueForKey:@"parentBridge"];
    [bridge.eventDispatcher sendAppEventWithName:eventName body:data];
}
```

#### 7.2 实时数据同步

```tsx
// JS 端实现
const DataSyncComponent = () => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // 监听数据更新
    const dataSubscription = DeviceEventEmitter.addListener(
      'dataUpdated',
      (newData) => {
        setData(newData);
        console.log('数据已更新:', newData);
      }
    );
  
    // 启动数据同步
    NativeInvoker.call('data.startSync');
  
    return () => {
      dataSubscription.remove();
      NativeInvoker.call('data.stopSync');
    };
  }, []);
  
  return (
    <View>
      <Text>实时数据: {JSON.stringify(data)}</Text>
    </View>
  );
};
```

```java
// Android 原生端实现
public void startDataSync() {
    // 启动后台线程进行数据同步
    new Thread(() -> {
        while (isSyncRunning) {
            try {
                // 获取最新数据
                Map<String, Object> latestData = fetchLatestData();
              
                // 通知 JS 数据更新
                notifyJSWithEvent("dataUpdated", latestData);
              
                Thread.sleep(5000); // 5秒同步一次
            } catch (InterruptedException e) {
                break;
            }
        }
    }).start();
}

private void notifyJSWithEvent(String eventName, Map<String, Object> data) {
    ReactContext reactContext = getReactApplicationContext();
    reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit(eventName, Arguments.fromMap(data));
}
```

### 8. 错误处理示例

#### 8.1 JS 端错误处理

```tsx
// JS 端统一错误处理
const handleNativeCall = async (method: string, params?: any) => {
  try {
    const result = await NativeInvoker.call(method, params);
    return { success: true, data: result };
  } catch (error) {
    // 根据错误类型处理
    if (error.message.includes('METHOD_NOT_FOUND')) {
      console.error('方法未找到:', method);
      return { success: false, error: '方法不存在' };
    } else if (error.message.includes('PERMISSION_DENIED')) {
      console.error('权限不足:', method);
      return { success: false, error: '权限不足' };
    } else {
      console.error('调用失败:', error);
      return { success: false, error: '调用失败' };
    }
  }
};
```

#### 8.2 原生端错误处理

```objc
// iOS 原生端错误处理
- (void)handleError:(NSError *)error inMethod:(NSString *)method {
    // 记录错误日志
    RCTLogError(@"方法 %@ 执行失败: %@", method, error.localizedDescription);
  
    // 通知 JS 错误信息
    [self notifyJSWithEvent:@"nativeError" data:@{
        @"method": method,
        @"error": error.localizedDescription,
        @"code": @(error.code)
    }];
}
```

### 9. 性能优化示例

#### 9.1 缓存机制

```tsx
// JS 端缓存实现
class NativeInvokerWithCache {
  private static cache = new Map();
  private static cacheTimeout = 5 * 60 * 1000; // 5分钟
  
  static async call(method: string, params?: any) {
    const cacheKey = `${method}_${JSON.stringify(params)}`;
    const cached = this.cache.get(cacheKey);
  
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      console.log('使用缓存结果:', method);
      return cached.data;
    }
  
    const result = await NativeInvoker.call(method, params);
  
    this.cache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });
  
    return result;
  }
}
```

#### 9.2 批量处理

```tsx
// JS 端批量处理
const batchProcessFiles = async (filePaths: string[]) => {
  const batchRequests = filePaths.map(path => ({
    method: 'file.process',
    params: { path }
  }));
  
  const results = await NativeInvoker.batchInvoke(batchRequests);
  return results;
};
```

```

---

## 🚀 优势分析

### 1. 开发效率提升

**传统方式：**

- 每个功能需要单独的原生模块
- 需要编写大量的样板代码
- 模块间缺乏统一性

**动态调用方式：**

- 一套接口处理所有业务场景
- 减少原生模块数量
- 统一的调用方式

### 2. 维护成本降低

**代码复用：**

- 统一的错误处理
- 统一的参数验证
- 统一的日志记录

**扩展性：**

- 新增功能只需注册方法
- 无需修改现有代码
- 支持热更新

### 3. 类型安全

```tsx
// 可以定义类型安全的调用
interface CameraMethods {
  'camera.takePhoto': {
    params: { quality?: string; flash?: string };
    return: string;
  };
  'camera.recordVideo': {
    params: { duration?: number; quality?: string };
    return: string;
  };
}

// 类型安全的调用
const photoPath: string = await NativeInvoker.call<CameraMethods['camera.takePhoto']>(
  'camera.takePhoto',
  { quality: 'high' }
);
```

---

## 🎯 最佳实践

### 1. 方法命名规范

```tsx
// 使用点号分隔的命名空间
const methodNaming = {
  // 模块.功能.操作
  'camera.takePhoto': '拍照',
  'camera.recordVideo': '录制视频',
  
  // 支持子命名空间
  'file.image.compress': '压缩图片',
  'file.image.resize': '调整图片大小',
  
  // 支持版本控制
  'api.v1.user.login': '用户登录',
  'api.v2.user.login': '用户登录V2',
};
```

### 2. 参数设计

```tsx
// 参数应该具有明确的类型定义
interface CameraParams {
  quality: 'low' | 'medium' | 'high';
  flash?: 'auto' | 'on' | 'off';
  saveToGallery?: boolean;
}

// 使用类型安全的调用
const photoPath = await NativeInvoker.call<CameraParams>('camera.takePhoto', {
  quality: 'high',
  flash: 'auto',
  saveToGallery: true
});
```

### 3. 错误处理

```tsx
// 统一的错误处理
class NativeInvokerError extends Error {
  constructor(
    message: string,
    public method: string,
    public params?: any
  ) {
    super(message);
    this.name = 'NativeInvokerError';
  }
}

// 在调用时处理错误
try {
  const result = await NativeInvoker.call('some.method', params);
} catch (error) {
  if (error instanceof NativeInvokerError) {
    console.error(`调用 ${error.method} 失败:`, error.message);
  }
}
```

---

## ⚠️ 注意事项

### 1. 性能考虑

#### 性能对比数据

**反射调用 vs 直接调用性能差异：**

- **单次调用延迟**：反射调用比直接调用慢 **2-5倍**
- **批量调用（1000次）**：反射调用比直接调用慢 **3-8倍**
- **内存开销**：反射调用额外增加 **20-50%** 内存占用

#### 具体数据

```
直接调用：
- 单次：0.1-0.3ms
- 1000次：50-80ms
- 内存：基础开销

反射调用：
- 单次：0.5-1.5ms  
- 1000次：200-500ms
- 内存：基础开销 + 20-50%
```

#### 使用建议

**✅ 建议使用反射的场景：**

- **开发阶段** - 快速原型、调试、测试
- **低频调用** - 用户手动触发，< 10次/分钟
- **动态功能** - 插件系统、热更新功能
- **配置化需求** - 根据配置动态调用不同模块
- **跨平台统一** - 需要一套接口适配多个平台

**❌ 不建议使用反射的场景：**

- **高频调用** - 动画、滚动、实时更新
- **性能敏感** - 列表渲染、大量数据处理
- **启动阶段** - 应用初始化、首屏加载
- **电池优化** - 需要省电的场景
- **生产环境核心功能** - 用户经常使用的功能

#### 性能优化策略

**缓存机制：**

```tsx
// 缓存反射调用结果
const methodCache = new Map();

static async invoke(request: NativeCallRequest): Promise<any> {
  const cacheKey = `${request.method}_${JSON.stringify(request.params)}`;
  
  if (methodCache.has(cacheKey)) {
    return methodCache.get(cacheKey);
  }
  
  const result = await this.getInstance().invoke(request);
  methodCache.set(cacheKey, result);
  return result;
}
```

**批量处理：**

```tsx
// 合并多个反射调用
static async batchInvoke(requests: NativeCallRequest[]): Promise<any[]> {
  return await this.getInstance().batchInvoke(requests);
}
```

**异步处理：**

```tsx
// 在后台线程执行反射调用
static async invokeAsync(request: NativeCallRequest): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const result = await this.invoke(request);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, 0);
  });
}
```

**混合使用策略：**

- **核心功能**：使用直接调用保证性能
- **扩展功能**：使用反射调用提高灵活性
- **开发阶段**：使用反射调用快速迭代
- **生产环境**：根据性能要求选择调用方式

### 2. 类型安全

**挑战：**

- 动态调用难以保证类型安全
- 运行时错误难以发现

**解决方案：**

- 定义完整的 TypeScript 类型
- 使用泛型约束参数类型
- 编写单元测试验证

### 3. 调试困难

**问题：**

- 动态调用难以调试
- 错误堆栈不够清晰

**解决方案：**

- 添加详细的日志记录
- 使用开发工具监控调用
- 提供调试模式

---

## 📚 参考资料

- [React Native TurboModules 文档](https://reactnative.dev/docs/turbomodules)
- [iOS 反射机制](https://developer.apple.com/documentation/objectivec/objective-c_runtime)
- [Android 反射机制](https://docs.oracle.com/javase/tutorial/reflect/)

---
