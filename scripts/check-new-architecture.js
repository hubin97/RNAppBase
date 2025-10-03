#!/usr/bin/env node

// const fs = require('fs');
// const path = require('path');
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 在 ES 模块中获取 __dirname 的等价物
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log('🔍 检查 React Native 新架构配置状态...\n');

// 检查项目根目录
const projectRoot = path.join(__dirname, '..');
const packageJsonPath = path.join(projectRoot, 'package.json');
const iosInfoPlistPath = path.join(projectRoot, 'ios', 'RNAppBase', 'Info.plist');
const androidBuildGradlePath = path.join(projectRoot, 'android', 'app', 'build.gradle');
const androidGradlePropertiesPath = path.join(projectRoot, 'android', 'gradle.properties');

let score = 0;
const totalScore = 100;

// 1. 检查 React Native 版本
console.log('📦 检查 React Native 版本...');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const rnVersion = packageJson.dependencies['react-native'];
  
  if (rnVersion) {
    const version = rnVersion.replace(/[^0-9.]/g, '');
    const major = parseInt(version.split('.')[0]);
    const minor = parseInt(version.split('.')[1]);
    
    if (major >= 0 && minor >= 70) {
      console.log(`✅ React Native 版本: ${rnVersion} (支持新架构)`);
      score += 20;
    } else {
      console.log(`⚠️  React Native 版本: ${rnVersion} (建议升级到 0.70+)`);
      score += 10;
    }
  } else {
    console.log('❌ 未找到 React Native 依赖');
  }
} else {
  console.log('❌ 未找到 package.json');
}

// 2. 检查 iOS 新架构配置
console.log('\n🍎 检查 iOS 新架构配置...');
if (fs.existsSync(iosInfoPlistPath)) {
  const infoPlistContent = fs.readFileSync(iosInfoPlistPath, 'utf8');
  
  if (infoPlistContent.includes('RCTNewArchEnabled') && infoPlistContent.includes('<true/>')) {
    console.log('✅ iOS 新架构已启用 (RCTNewArchEnabled = true)');
    score += 25;
  } else if (infoPlistContent.includes('RCTNewArchEnabled')) {
    console.log('⚠️  iOS 新架构配置存在但未启用');
    score += 10;
  } else {
    console.log('❌ iOS 新架构未配置');
    console.log('   请在 ios/RNAppBase/Info.plist 中添加:');
    console.log('   <key>RCTNewArchEnabled</key>');
    console.log('   <true/>');
  }
} else {
  console.log('❌ 未找到 iOS Info.plist 文件');
}

// 3. 检查 Android 新架构配置
console.log('\n🤖 检查 Android 新架构配置...');

// 检查 gradle.properties
let androidNewArchEnabled = false;
if (fs.existsSync(androidGradlePropertiesPath)) {
  const gradlePropertiesContent = fs.readFileSync(androidGradlePropertiesPath, 'utf8');
  if (gradlePropertiesContent.includes('newArchEnabled=true')) {
    console.log('✅ Android 新架构已启用 (gradle.properties)');
    androidNewArchEnabled = true;
    score += 25;
  }
}

// 检查 build.gradle
if (fs.existsSync(androidBuildGradlePath)) {
  const buildGradleContent = fs.readFileSync(androidBuildGradlePath, 'utf8');
  
  if (buildGradleContent.includes('autolinkLibrariesWithApp()')) {
    console.log('✅ Android 自动链接已启用');
    score += 10;
  } else {
    console.log('⚠️  Android 自动链接未配置');
  }
  
  if (buildGradleContent.includes('hermesEnabled') && buildGradleContent.includes('true')) {
    console.log('✅ Hermes 引擎已启用');
    score += 10;
  } else {
    console.log('⚠️  Hermes 引擎未明确启用');
  }
}

if (!androidNewArchEnabled) {
  console.log('⚠️  Android 新架构未启用');
  console.log('   请在 android/gradle.properties 中添加:');
  console.log('   newArchEnabled=true');
}

// 4. 检查依赖兼容性
console.log('\n🔗 检查依赖兼容性...');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const compatibleLibraries = [
    '@react-navigation/native',
    '@react-navigation/stack',
    '@react-navigation/bottom-tabs',
    'react-native-reanimated',
    'react-native-gesture-handler',
    'react-native-screens',
    'react-native-safe-area-context'
  ];
  
  let compatibleCount = 0;
  compatibleLibraries.forEach(lib => {
    if (dependencies[lib]) {
      console.log(`✅ ${lib} 已安装`);
      compatibleCount++;
    }
  });
  
  if (compatibleCount > 0) {
    score += Math.min(10, compatibleCount * 2);
  }
}

// 5. 生成报告
console.log('\n📊 配置状态报告');
console.log('='.repeat(50));
console.log(`总分: ${score}/${totalScore}`);

if (score >= 80) {
  console.log('🎉 新架构配置状态: 优秀');
  console.log('   你的项目已经很好地支持新架构！');
} else if (score >= 60) {
  console.log('👍 新架构配置状态: 良好');
  console.log('   建议完善一些配置以获得更好的性能。');
} else if (score >= 40) {
  console.log('⚠️  新架构配置状态: 需要改进');
  console.log('   建议按照上述提示完善配置。');
} else {
  console.log('❌ 新架构配置状态: 需要大量工作');
  console.log('   建议参考文档进行完整配置。');
}

// 6. 提供建议
console.log('\n💡 优化建议:');

if (score < 80) {
  console.log('1. 确保 React Native 版本 >= 0.70');
  console.log('2. 在 iOS Info.plist 中启用 RCTNewArchEnabled');
  console.log('3. 在 Android gradle.properties 中启用 newArchEnabled');
  console.log('4. 更新第三方库到支持新架构的版本');
  console.log('5. 使用 Hermes 引擎');
}

console.log('\n📖 更多信息请查看: docs/React Native新架构分析文档.md');

// 7. 检查命令
console.log('\n🔧 建议执行的命令:');
console.log('npx react-native doctor');
console.log('npx react-native info');
console.log('cd ios && pod install && cd ..');
console.log('cd android && ./gradlew clean && cd ..'); 