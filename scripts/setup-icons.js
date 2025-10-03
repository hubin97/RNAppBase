#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// 在 ES 模块中获取 __dirname 的等价物
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 开始配置 react-native-vector-icons...\n');

// 检查 node_modules 是否存在
const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.error('❌ node_modules 不存在，请先运行 npm install 或 yarn install');
  process.exit(1);
}

// 检查 react-native-vector-icons 是否安装
const vectorIconsPath = path.join(nodeModulesPath, 'react-native-vector-icons');
if (!fs.existsSync(vectorIconsPath)) {
  console.error('❌ react-native-vector-icons 未安装，请先安装：npm install react-native-vector-icons');
  process.exit(1);
}

// 字体文件源目录
const fontsSourcePath = path.join(vectorIconsPath, 'Fonts');

// Android 配置
const androidFontsPath = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'assets', 'fonts');

console.log('📱 配置 Android 字体文件...');

// 创建 Android 字体目录
if (!fs.existsSync(androidFontsPath)) {
  fs.mkdirSync(androidFontsPath, { recursive: true });
  console.log('✅ 创建 Android 字体目录');
}

// 复制字体文件到 Android
try {
  const fontFiles = fs.readdirSync(fontsSourcePath).filter(file => file.endsWith('.ttf'));
  
  fontFiles.forEach(fontFile => {
    const sourcePath = path.join(fontsSourcePath, fontFile);
    const destPath = path.join(androidFontsPath, fontFile);
    
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✅ 复制 ${fontFile} 到 Android`);
  });
} catch (error) {
  console.error('❌ 复制 Android 字体文件失败:', error.message);
}

// iOS 配置
const iosFontsPath = path.join(__dirname, '..', 'ios', 'RNAppBase', 'Fonts');

console.log('\n🍎 配置 iOS 字体文件...');

// 创建 iOS 字体目录
if (!fs.existsSync(iosFontsPath)) {
  fs.mkdirSync(iosFontsPath, { recursive: true });
  console.log('✅ 创建 iOS 字体目录');
}

// 复制字体文件到 iOS
try {
  const fontFiles = fs.readdirSync(fontsSourcePath).filter(file => file.endsWith('.ttf'));
  
  fontFiles.forEach(fontFile => {
    const sourcePath = path.join(fontsSourcePath, fontFile);
    const destPath = path.join(iosFontsPath, fontFile);
    
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✅ 复制 ${fontFile} 到 iOS`);
  });
} catch (error) {
  console.error('❌ 复制 iOS 字体文件失败:', error.message);
}

// 检查并更新 Android build.gradle
console.log('\n🔧 检查 Android build.gradle 配置...');

const androidBuildGradlePath = path.join(__dirname, '..', 'android', 'app', 'build.gradle');

if (fs.existsSync(androidBuildGradlePath)) {
  let buildGradleContent = fs.readFileSync(androidBuildGradlePath, 'utf8');
  
  // 检查是否已经配置了 vectoricons
  if (!buildGradleContent.includes('vectoricons')) {
    console.log('⚠️  请在 android/app/build.gradle 中添加以下配置：');
    console.log(`
project.ext.vectoricons = [
    iconFontNames: [
        'Ionicons.ttf',
        'MaterialIcons.ttf',
        'MaterialCommunityIcons.ttf',
        'FontAwesome.ttf',
        'FontAwesome5_Brands.ttf',
        'FontAwesome5_Regular.ttf',
        'FontAwesome5_Solid.ttf',
        'FontAwesome6_Brands.ttf',
        'FontAwesome6_Regular.ttf',
        'FontAwesome6_Solid.ttf',
        'AntDesign.ttf',
        'Entypo.ttf',
        'EvilIcons.ttf',
        'Feather.ttf',
        'Fontisto.ttf',
        'Foundation.ttf',
        'Octicons.ttf',
        'SimpleLineIcons.ttf',
        'Zocial.ttf'
    ]
]

apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
    `);
  } else {
    console.log('✅ Android build.gradle 已配置 vectoricons');
  }
} else {
  console.log('⚠️  未找到 Android build.gradle 文件');
}

// 检查并更新 iOS Info.plist
console.log('\n🔧 检查 iOS Info.plist 配置...');

const iosInfoPlistPath = path.join(__dirname, '..', 'ios', 'RNAppBase', 'Info.plist');

if (fs.existsSync(iosInfoPlistPath)) {
  let infoPlistContent = fs.readFileSync(iosInfoPlistPath, 'utf8');
  
  // 检查是否已经配置了 UIAppFonts
  if (!infoPlistContent.includes('UIAppFonts')) {
    console.log('⚠️  请在 ios/RNAppBase/Info.plist 中添加以下配置：');
    console.log(`
<key>UIAppFonts</key>
<array>
    <string>Ionicons.ttf</string>
    <string>MaterialIcons.ttf</string>
    <string>MaterialCommunityIcons.ttf</string>
    <string>FontAwesome.ttf</string>
    <string>FontAwesome5_Brands.ttf</string>
    <string>FontAwesome5_Regular.ttf</string>
    <string>FontAwesome5_Solid.ttf</string>
    <string>FontAwesome6_Brands.ttf</string>
    <string>FontAwesome6_Regular.ttf</string>
    <string>FontAwesome6_Solid.ttf</string>
    <string>AntDesign.ttf</string>
    <string>Entypo.ttf</string>
    <string>EvilIcons.ttf</string>
    <string>Feather.ttf</string>
    <string>Fontisto.ttf</string>
    <string>Foundation.ttf</string>
    <string>Octicons.ttf</string>
    <string>SimpleLineIcons.ttf</string>
    <string>Zocial.ttf</string>
</array>
    `);
  } else {
    console.log('✅ iOS Info.plist 已配置 UIAppFonts');
  }
} else {
  console.log('⚠️  未找到 iOS Info.plist 文件');
}

console.log('\n🎉 图标字体配置完成！');
console.log('\n📋 接下来的步骤：');
console.log('1. 如果提示需要配置 build.gradle 或 Info.plist，请按照提示添加配置');
console.log('2. 重新构建项目：');
console.log('   Android: cd android && ./gradlew clean && cd .. && npx react-native run-android');
console.log('   iOS: cd ios && pod install && cd .. && npx react-native run-ios');
console.log('3. 开始使用通用图标组件：import Icon from "@/components/ui/Icon"');
console.log('\n📖 更多信息请查看：docs/图标字体配置文档.md');