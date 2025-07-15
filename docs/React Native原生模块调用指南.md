# React Native 原生模块调用指南

---

## 1. 旧架构（Bridge）

### 1.1 JS 如何调用原生

- **必要导入**
  ```js
  import { NativeModules } from 'react-native';
  ```
- **调用示例**
  ```js
  // 调用 CameraModule 的 takePhoto 方法
  NativeModules.CameraModule.takePhoto((error, photoPath) => {
    if (error) {
      console.error('拍照失败:', error);
      return;
    }
    console.log('照片路径:', photoPath);
  });
  ```

### 1.2 原生如何处理 JS 调用

- **Android (CameraModule.java)**

  ```java
  // 文件：android/app/src/main/java/com/xxx/CameraModule.java
  import com.facebook.react.bridge.Callback;
  import com.facebook.react.bridge.ReactContextBaseJavaModule;
  import com.facebook.react.bridge.ReactMethod;

  public class CameraModule extends ReactContextBaseJavaModule {
      @ReactMethod
      public void takePhoto(Callback callback) {
          String photoPath = capturePhoto();
          callback.invoke(null, photoPath);
      }
  }
  ```
- **iOS (CameraModule.m) 重要细节**

  ```objc
  // 文件：ios/CameraModule.m
  #import <React/RCTBridgeModule.h>
  #import <React/RCTEventEmitter.h>

  @interface CameraModule : RCTEventEmitter <RCTBridgeModule>
  @end

  @implementation CameraModule

  // 必须声明，导出模块给 JS
  RCT_EXPORT_MODULE();

  // 必须实现，声明支持的事件
  - (NSArray<NSString *> *)supportedEvents {
      return @[@"onPhotoTaken"];
  }

  RCT_EXPORT_METHOD(takePhoto:(RCTResponseSenderBlock)callback)
  {
      NSString *photoPath = [self capturePhoto];
      callback(@[NSNull.null, photoPath]);
      // 发送事件
      [self sendEventWithName:@"onPhotoTaken" body:@{@"event": @"拍照完成"}];
  }

  @end
  ```

### 1.3 原生如何调用 JS（事件）

- **Android**

  ```java
  // 文件：android/app/src/main/java/com/xxx/CameraModule.java
  import com.facebook.react.bridge.Arguments;
  import com.facebook.react.bridge.WritableMap;
  import com.facebook.react.modules.core.DeviceEventManagerModule;

  WritableMap params = Arguments.createMap();
  params.putString("event", "拍照完成");
  getReactApplicationContext()
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit("onPhotoTaken", params);
  ```
- **iOS**

  ```objc
  // 文件：ios/CameraModule.m
  // 事件发送见上方 sendEventWithName:body: 示例
  ```

### 1.4 JS 如何处理原生事件

- **必要导入**
  ```js
  import { NativeEventEmitter, NativeModules } from 'react-native';
  const emitter = new NativeEventEmitter(NativeModules.CameraModule);
  ```
- **监听示例**
  ```js
  emitter.addListener('onPhotoTaken', (data) => {
    console.log('收到原生事件:', data);
  });
  ```

---

## 2. 新架构（TurboModules）

### 2.1 JS 如何调用原生

- **必要导入**
  ```js
  import { TurboModuleRegistry } from 'react-native';
  ```
- **调用示例**
  ```js
  // 获取 CameraModule 实例
  const CameraModule = TurboModuleRegistry.get('CameraModule');

  // 调用 takePhoto 方法
  const takePhoto = async () => {
    try {
      const photoPath = await CameraModule.takePhoto();
      console.log('照片路径:', photoPath);
    } catch (error) {
      console.error('拍照失败:', error);
    }
  };
  ```

### 2.2 原生如何处理 JS 调用

- **Android (CameraModule.java)**

  ```java
  // 文件：android/app/src/main/java/com/xxx/CameraModule.java
  import com.facebook.react.module.annotations.ReactModule;
  import com.facebook.react.turbomodule.core.TurboModule;
  import com.facebook.react.bridge.ReactMethod;

  @ReactModule(name = "CameraModule")
  public class CameraModule extends TurboModule {
      @ReactMethod
      public String takePhoto() {
          return capturePhoto();
      }
  }
  ```
- **iOS (CameraModule.m)**

  ```objc
  // 文件：ios/CameraModule.m
  #import <React/RCTTurboModule.h>

  @interface CameraModule : RCTTurboModule
  @end

  @implementation CameraModule

  RCT_EXPORT_METHOD(takePhoto:(RCTPromiseResolveBlock)resolve
                    rejecter:(RCTPromiseRejectBlock)reject)
  {
      @try {
          NSString *photoPath = [self capturePhoto];
          resolve(photoPath);
      } @catch (NSException *exception) {
          reject(@"CAMERA_ERROR", exception.reason, nil);
      }
  }

  @end
  ```

### 2.3 原生如何调用 JS（事件）

- **Android**

  ```java
  // 文件：android/app/src/main/java/com/xxx/CameraModule.java
  import com.facebook.react.bridge.Arguments;
  import com.facebook.react.bridge.WritableMap;
  import com.facebook.react.modules.core.DeviceEventManagerModule;

  WritableMap params = Arguments.createMap();
  params.putString("event", "拍照完成");
  getReactApplicationContext()
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit("onPhotoTaken", params);
  ```
- **iOS**

  ```objc
  // 文件：ios/CameraModule.m
  // 事件发送同旧架构，推荐继承 RCTEventEmitter 并实现 supportedEvents
  [self sendEventWithName:@"onPhotoTaken" body:@{@"event": @"拍照完成"}];
  ```

### 2.4 JS 如何处理原生事件

- **必要导入**
  ```js
  import { DeviceEventEmitter } from 'react-native';
  ```
- **监听示例**
  ```js
  DeviceEventEmitter.addListener('onPhotoTaken', (data) => {
    console.log('收到原生事件:', data);
  });
  ```

## 3. Codegen 自动生成流程与配置

### 3.1 作用

Codegen 用于自动生成原生与 JS/TS 之间的类型绑定和注册代码，提升类型安全和开发效率，减少手写桥接代码。

### 3.2 配置文件 codegenConfig.json

在项目根目录创建 `codegenConfig.json`，指定模块名、TS/Flow 规范目录、原生输出路径等。例如：

```json
{
  "modules": [
    {
      "name": "CameraModule",
      "jsSrcsDir": "./src/specs",
      "android": { "javaPackageName": "com.yourapp.modules" },
      "ios": { "outputDir": "./ios/Generated" }
    }
  ]
}
```

- `name`：模块名，需与 JS/原生一致
- `jsSrcsDir`：TS/Flow 规范文件目录
- `android.javaPackageName`：生成 Java 代码的包名
- `ios.outputDir`：iOS 端生成代码的输出目录

### 3.3 使用流程

1. **定义 TS/Flow 规范文件**在 `src/specs` 下定义模块接口（如 `NativeCameraModule.ts`）：
   ```ts
   // src/specs/NativeCameraModule.ts
   import type { TurboModule } from 'react-native';
   import { TurboModuleRegistry } from 'react-native';

   export interface Spec extends TurboModule {
     takePhoto(): Promise<string>;
   }

   export default TurboModuleRegistry.getEnforcing<Spec>('CameraModule');
   ```
2. **配置 codegenConfig.json**按上例配置好模块名、路径、包名等。
3. **运行生成命令**
   ```bash
   npx react-native-codegen --config codegenConfig.json
   # 或自定义 yarn script
   ```
4. **重新编译原生工程**
   - iOS：`cd ios && pod install`
   - Android：`cd android && ./gradlew clean && cd ..`
5. **在原生端引入生成代码并实现接口**
   - Android 端实现生成的接口类
   - iOS 端实现生成的协议

### 3.4 注意事项

- `codegenConfig.json` 必须与实际模块名、路径、包名严格对应。
- 生成命令不是 React Native 内置，需确保依赖已安装（如 `react-native-codegen`）。
- 推荐所有方法返回 Promise，类型定义要准确，避免 callback。
- 生成后需重新编译原生工程，iOS 需 pod install。
- 模块名需与 JS/原生完全一致。
- 详细配置与用法见[官方文档](https://reactnative.dev/docs/codegen)。

### 3.5 CodePush 可用性注意事项

- **CodePush 服务可继续使用，直至 2026 年 6 月 30 日**。
- 2025 年 3 月 31 日后，App Center 其他功能（如构建、分发等）将退役，不再提供支持。
- 建议依赖 CodePush 的项目提前规划替代方案，避免服务中断风险。

## TurboModules（新架构）使用注意

1. **模块导出要求**

   - **iOS 端**：TurboModules 依然需要导出模块给 JS。手写模块时需在 @implementation 内部写 `RCT_EXPORT_MODULE();`，如用 Codegen 自动生成则由工具自动插入。
     ```objc
     #import <React/RCTTurboModule.h>
     @interface CameraModule : NSObject <RCTTurboModule>
     @end
     @implementation CameraModule
     RCT_EXPORT_MODULE();
     // ...
     @end
     ```
   - **Android 端**：TurboModules 必须用 `@ReactModule(name = "模块名")` 注解，并继承 `TurboModule`，不再需要实现 `getName()`。
     ```java
     @ReactModule(name = "CameraModule")
     public class CameraModule extends TurboModule {
         // ...
     }
     ```
2. **事件通信与方法定义注意事项**

   - **iOS 端事件模块** 依然必须继承 `RCTEventEmitter`，实现 `supportedEvents`，并用 `sendEventWithName:body:` 发送事件。
   - **Android 端事件发送** 方式与旧架构一致，无需特殊声明或基类。
   - **JS 端监听方式** 不变，Android 用 `DeviceEventEmitter`，iOS 推荐用 `NativeEventEmitter`（并传入 NativeModules.YourModule）。
   - **事件名** 推荐与 JS 端监听名保持一致，避免大小写或拼写不一致导致监听不到。
   - **事件监听后注意及时移除**，避免内存泄漏。
   - **TurboModules 方法签名** 必须与 JS/TS 类型定义严格一致，不支持 callback 形式，推荐全部用 Promise/async-await。
   - **模块名** 必须与 JS 端 `TurboModuleRegistry.get('模块名')` 保持一致。
