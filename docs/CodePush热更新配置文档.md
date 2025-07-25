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

## 12.可用性注意事项

- **CodePush 服务可继续使用，直至 2026 年 6 月 30 日**。
- 2025 年 3 月 31 日后，App Center 其他功能（如构建、分发等）将退役，不再提供支持。
- 建议依赖 CodePush 的项目提前规划替代方案，避免服务中断风险。

---

## 13. 自建 CodePush 服务器与迁移方案

随着微软宣布 App Center 将于 2026 年 6 月 30 日彻底退役，CodePush 官方云服务也将随之下线。为保障业务连续性，建议提前规划自建 CodePush 服务。具体说明如下：

### 13.1 官方说明

- 微软已开源 CodePush 服务端（code-push-server），并提供了独立于 App Center 的特殊版本。
- 你可以在 GitHub 上获取源代码和文档，完全自主管理热更新服务。
- 参考仓库：[microsoft/code-push-server（官方归档）](https://github.com/microsoft/code-push-server) 及 [lisong/code-push-server（社区维护，推荐）](https://github.com/lisong/code-push-server)

### 13.2 自建服务部署流程

1. **准备服务器**：选择云服务器或公司内网服务器，推荐 Linux 环境。
2. **部署 code-push-server**：
   - 克隆社区维护的 code-push-server 仓库
   - 按文档配置数据库（MongoDB）、存储（本地/OSS/S3）、认证等
   - 启动服务端，开放 API 端口
3. **客户端配置**：
   - 继续使用 `react-native-code-push` SDK
   - 在客户端配置中，将 CodePush 服务器地址指向自建服务（详见社区文档）
4. **热更新包发布**：
   - 使用自建服务提供的 CLI 工具（兼容 code-push 命令行）上传 JS bundle
   - 客户端会从你的服务器拉取热更新包

### 13.3 迁移建议

- 在 App Center 下线前，提前搭建并测试自建 CodePush 服务，确保迁移平滑
- 关注社区维护的 code-push-server 项目，获取最新兼容性和安全更新
- 迁移后，部署、发布、管理流程与 App Center 类似，只是服务器变成你自己维护

### 13.4 参考链接

- [microsoft/code-push-server（官方已归档）](https://github.com/microsoft/code-push-server)
- [lisong/code-push-server（社区维护，推荐）](https://github.com/lisong/code-push-server)
- [react-native-code-push 文档](https://github.com/microsoft/react-native-code-push)

---
