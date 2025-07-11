# CodePush 热更新完整配置文档

## 1. CodePush 简介

**CodePush** 是微软提供的 React Native 热更新服务，允许你直接向用户推送 JavaScript 代码和资源更新，无需通过应用商店审核。

### 优点

- ✅ 官方支持，稳定可靠
- ✅ 配置简单，文档完善
- ✅ 有完整的管理后台和统计
- ✅ 支持灰度发布和回滚
- ✅ 免费额度足够个人/小团队使用

### 缺点

- ❌ 需要微软账号
- ❌ 有使用限制（免费版每月 1000 次部署）
- ❌ 依赖第三方服务

---

## 2. 安装和配置

### 2.1 安装依赖

```bash
# 安装 CodePush 依赖
yarn add react-native-code-push

# iOS 需要安装 Pod
cd ios && pod install && cd ..
```

### 2.2 安装 CodePush CLI

```bash
# 全局安装 CodePush CLI
npm install -g appcenter-cli

# 登录微软账号
appcenter login
```

### 2.3 创建 CodePush 应用

```bash
# 创建 Android 应用
appcenter apps create -d RNAppBase-Android -o <your-org> -p React-Native

# 创建 iOS 应用  
appcenter apps create -d RNAppBase-iOS -o <your-org> -p React-Native

# 查看应用列表
appcenter apps list
```

---

## 3. 项目配置

### 3.1 Android 配置

#### 修改 `android/app/build.gradle`

```gradle
// 在文件顶部添加
apply from: "../../node_modules/react-native-code-push/android/codepush.gradle"

android {
    // ... 现有配置 ...
  
    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            signingConfig signingConfigs.debug
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}
```

#### 修改 `android/app/src/main/java/com/rnappbase/MainApplication.kt`

```kotlin
package com.rnappbase

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader
import com.microsoft.codepush.react.CodePush

class MainApplication : Application(), ReactApplication {
    override val reactNativeHost: ReactNativeHost =
        object : DefaultReactNativeHost(this) {
            override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG
            override fun getPackages(): List<ReactPackage> =
                PackageList(this).packages.apply {
                    // 添加 CodePush 包
                    add(CodePush("YOUR_DEPLOYMENT_KEY", this@MainApplication, BuildConfig.DEBUG))
                }

            override fun getJSMainModuleName(): String = "index"

            override fun getUseHermes(): Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
            override fun isHermesEnabled(): Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        }

    override val reactHost: ReactHost
        get() = getDefaultReactHost(this.applicationContext, reactNativeHost)

    override fun onCreate() {
        super.onCreate()
        SoLoader.init(this, false)
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            load()
        }
    }
}
```

### 3.2 iOS 配置

#### 修改 `ios/RNAppBase/AppDelegate.swift`

```swift
import UIKit
import CodePush

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    let moduleName = "RNAppBase"
    let initialProperties = [String: Any]()

    let reactRootView = RCTAppSetupDefaultRootView(
      bridge: bridge,
      moduleName: moduleName,
      initialProperties: initialProperties
    )

    if #available(iOS 13.0, *) {
      reactRootView.backgroundColor = UIColor.systemBackground
    } else {
      reactRootView.backgroundColor = UIColor.white
    }

    window = UIWindow(frame: UIScreen.main.bounds)
    let rootViewController = UIViewController()
    rootViewController.view = reactRootView
    window?.rootViewController = rootViewController
    window?.makeKeyAndVisible()
    return true
  }

  var bridge: RCTBridge! {
    return bridge
  }

  var sourceURL: URL? {
    #if DEBUG
      return RCTBundleURLProvider.sharedSettings()?.jsBundleURL(forBundleRoot: "index")
    #else
      return CodePush.bundleURL()
    #endif
  }
}
```

### 3.3 修改 App.tsx

```tsx
import React from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CodePush from 'react-native-code-push';
import { store } from '@/store';
import AppNavigator from '@/navigation/AppNavigator';

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </Provider>
  );
}

// CodePush 配置
const codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
  installMode: CodePush.InstallMode.IMMEDIATE,
  mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
  updateDialog: {
    title: "更新提示",
    mandatoryUpdateMessage: "必须更新才能继续使用",
    mandatoryContinueButtonLabel: "立即更新",
    optionalUpdateMessage: "有新版本可用",
    optionalIgnoreButtonLabel: "稍后",
    optionalInstallButtonLabel: "立即安装"
  }
};

export default CodePush(codePushOptions)(App);
```

---

## 4. 获取部署密钥

### 4.1 获取 Android 部署密钥

```bash
# 获取 Android 部署密钥
appcenter codepush deployment list -a <your-org>/RNAppBase-Android

# 输出类似：
# ┌─────────────┬─────────────────────────────────────┬─────────────┐
# │ Name        │ Key                                │ Install Metrics │
# ├─────────────┼─────────────────────────────────────┼─────────────┤
# │ Production  │ xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx │ 0            │
# │ Staging     │ yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy │ 0            │
# └─────────────┴─────────────────────────────────────┴─────────────┘
```

### 4.2 获取 iOS 部署密钥

```bash
# 获取 iOS 部署密钥
appcenter codepush deployment list -a <your-org>/RNAppBase-iOS
```

### 4.3 更新部署密钥

将获取到的密钥替换到代码中：

**Android**: `MainApplication.kt` 中的 `"YOUR_DEPLOYMENT_KEY"`
**iOS**: 会自动使用正确的密钥

---

## 5. 发布热更新

### 5.1 发布到 Staging 环境

```bash
# 发布 Android Staging
appcenter codepush release-react -a <your-org>/RNAppBase-Android -d Staging

# 发布 iOS Staging  
appcenter codepush release-react -a <your-org>/RNAppBase-iOS -d Staging
```

### 5.2 发布到 Production 环境

```bash
# 发布 Android Production
appcenter codepush release-react -a <your-org>/RNAppBase-Android -d Production

# 发布 iOS Production
appcenter codepush release-react -a <your-org>/RNAppBase-iOS -d Production
```

### 5.3 高级发布选项

```bash
# 发布时添加描述
appcenter codepush release-react -a <your-org>/RNAppBase-Android -d Production -m "修复登录问题"

# 强制更新（用户必须更新）
appcenter codepush release-react -a <your-org>/RNAppBase-Android -d Production -m "重要更新" --mandatory

# 指定目标版本
appcenter codepush release-react -a <your-org>/RNAppBase-Android -d Production -t "1.0.0"
```

---

## 6. 管理热更新

### 6.1 查看部署状态

```bash
# 查看 Android 部署
appcenter codepush deployment list -a <your-org>/RNAppBase-Android

# 查看 iOS 部署
appcenter codepush deployment list -a <your-org>/RNAppBase-iOS
```

### 6.2 回滚更新

```bash
# 回滚到上一个版本
appcenter codepush release-react -a <your-org>/RNAppBase-Android -d Production --rollout 0

# 回滚到指定版本
appcenter codepush release-react -a <your-org>/RNAppBase-Android -d Production --rollout 0 -t "1.0.0"
```

### 6.3 灰度发布

```bash
# 发布到 50% 用户
appcenter codepush release-react -a <your-org>/RNAppBase-Android -d Production --rollout 50
```

---

## 7. 添加脚本到 package.json

```json
{
  "scripts": {
    "codepush:android:staging": "appcenter codepush release-react -a <your-org>/RNAppBase-Android -d Staging",
    "codepush:android:prod": "appcenter codepush release-react -a <your-org>/RNAppBase-Android -d Production",
    "codepush:ios:staging": "appcenter codepush release-react -a <your-org>/RNAppBase-iOS -d Staging", 
    "codepush:ios:prod": "appcenter codepush release-react -a <your-org>/RNAppBase-iOS -d Production",
    "codepush:staging": "npm run codepush:android:staging && npm run codepush:ios:staging",
    "codepush:prod": "npm run codepush:android:prod && npm run codepush:ios:prod"
  }
}
```

---

## 8. 最佳实践

### 8.1 版本管理

- 每次发布热更新时添加版本描述
- 使用语义化版本号
- 记录更新日志

### 8.2 测试流程

1. 先在 Staging 环境测试
2. 确认无误后发布到 Production
3. 监控更新成功率

### 8.3 错误处理

```tsx
// 在 App.tsx 中添加错误处理
const codePushOptions = {
  // ... 其他配置
  onSyncStatusChange: (syncStatus: CodePush.SyncStatus) => {
    console.log('CodePush sync status:', syncStatus);
  },
  onUpdateDialog: (updateDialog: CodePush.UpdateDialog) => {
    console.log('Update dialog:', updateDialog);
  }
};
```

---

## 9. 常见问题

### Q: 热更新不生效？

A: 检查部署密钥是否正确，确保网络连接正常

### Q: 如何强制更新？

A: 使用 `--mandatory` 参数发布

### Q: 如何回滚？

A: 使用 `--rollout 0` 参数回滚到上一个版本

### Q: 免费版限制？

A: 每月 1000 次部署，对于大多数项目足够使用

---

## 10. 总结

CodePush 提供了完整的 React Native 热更新解决方案：

1. **配置简单**：只需几行代码即可集成
2. **管理方便**：有完整的 CLI 和后台管理
3. **功能强大**：支持灰度发布、回滚、强制更新等
4. **稳定可靠**：微软官方支持，生产环境验证

按照以上步骤配置，你的 React Native 应用就能支持热更新了！

---

## 11. 相关链接

- [CodePush 官方文档](https://docs.microsoft.com/en-us/appcenter/distribution/codepush/)
- [React Native CodePush 文档](https://github.com/microsoft/react-native-code-push)
- [AppCenter CLI 文档](https://docs.microsoft.com/en-us/appcenter/cli/)

---

*文档版本：1.0.0*
*最后更新：2024年7月*
