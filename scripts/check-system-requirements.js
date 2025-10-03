#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 检查系统版本要求...\n');

// 检查项目根目录
const projectRoot = path.join(__dirname, '..');
const androidBuildGradlePath = path.join(projectRoot, 'android', 'build.gradle');
const iosInfoPlistPath = path.join(projectRoot, 'ios', 'RNAppBase', 'Info.plist');

let score = 0;
const totalScore = 100;

// 1. 检查 Android 系统要求
console.log('🤖 检查 Android 系统要求...');

if (fs.existsSync(androidBuildGradlePath)) {
  const buildGradleContent = fs.readFileSync(androidBuildGradlePath, 'utf8');
  
  // 提取 minSdkVersion
  const minSdkMatch = buildGradleContent.match(/minSdkVersion\s*=\s*(\d+)/);
  if (minSdkMatch) {
    const minSdkVersion = parseInt(minSdkMatch[1]);
    
    if (minSdkVersion >= 24) {
      console.log(`✅ Android 最低版本: API ${minSdkVersion} (Android ${getAndroidVersion(minSdkVersion)})`);
      score += 25;
      
      if (minSdkVersion >= 26) {
        console.log('   🎯 推荐版本，性能最佳');
        score += 10;
      } else {
        console.log('   ⚠️  建议升级到 API 26+ 以获得更好性能');
      }
    } else if (minSdkVersion >= 23) {
      console.log(`⚠️  Android 最低版本: API ${minSdkVersion} (Android ${getAndroidVersion(minSdkVersion)})`);
      console.log('   React Native 0.75+ 要求最低 API 24 (Android 7.0)');
      score += 15;
    } else {
      console.log(`❌ Android 最低版本过低: API ${minSdkVersion}`);
      console.log('   React Native 0.75+ 要求最低 API 24 (Android 7.0)');
      console.log('   新架构要求最低 API 24 (Android 7.0)');
    }
  } else {
    console.log('❌ 未找到 minSdkVersion 配置');
  }
  
  // 检查 targetSdkVersion
  const targetSdkMatch = buildGradleContent.match(/targetSdkVersion\s*=\s*(\d+)/);
  if (targetSdkMatch) {
    const targetSdkVersion = parseInt(targetSdkMatch[1]);
    console.log(`✅ Android 目标版本: API ${targetSdkVersion} (Android ${getAndroidVersion(targetSdkVersion)})`);
    score += 10;
  }
} else {
  console.log('❌ 未找到 Android build.gradle 文件');
}

// 2. 检查 iOS 系统要求
console.log('\n🍎 检查 iOS 系统要求...');

const pbxprojPath = path.join(projectRoot, 'ios', 'RNAppBase.xcodeproj', 'project.pbxproj');
if (fs.existsSync(pbxprojPath)) {
  const pbxprojContent = fs.readFileSync(pbxprojPath, 'utf8');
  const matches = [...pbxprojContent.matchAll(/IPHONEOS_DEPLOYMENT_TARGET = ([0-9.]+)/g)];
  if (matches.length > 0) {
    const versions = matches.map(m => parseFloat(m[1]));
    const minVersion = Math.min(...versions);
    if (minVersion >= 15.1) {
      console.log(`✅ iOS 最低版本: ${minVersion}`);
      score += 25;
      console.log('   🎯 推荐版本，性能最佳');
      score += 10;
    } else if (minVersion >= 14.0) {
      console.log(`⚠️  iOS 最低版本: ${minVersion} (模板默认)`);
      console.log('   React Native 0.80+ 官方要求最低 iOS 15.1');
      console.log('   建议将 Target 级别 IPHONEOS_DEPLOYMENT_TARGET 升级为 15.1');
      score += 15;
    } else {
      console.log(`❌ iOS 最低版本过低: ${minVersion}`);
      console.log('   React Native 0.80+ 官方要求最低 iOS 15.1');
      console.log('   新架构要求最低 iOS 15.1');
    }
  } else {
    console.log('⚠️  未找到 IPHONEOS_DEPLOYMENT_TARGET 配置');
    console.log('   建议在 Xcode 项目设置中配置 Deployment Target >= 15.1');
    score += 10;
  }
} else {
  console.log('❌ 未找到 iOS project.pbxproj 文件');
}

// 3. 检查开发环境
console.log('\n🛠️  检查开发环境...');

try {
  // 检查 Node.js 版本
  const nodeVersion = process.version;
  const nodeMajor = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (nodeMajor >= 18) {
    console.log(`✅ Node.js 版本: ${nodeVersion}`);
    score += 10;
  } else {
    console.log(`⚠️  Node.js 版本过低: ${nodeVersion}`);
    console.log('   建议升级到 Node.js 18+');
  }
} catch (error) {
  console.log('❌ 无法检查 Node.js 版本');
}

// 4. 检查 React Native 版本
console.log('\n📦 检查 React Native 版本...');

const packageJsonPath = path.join(projectRoot, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const rnVersion = packageJson.dependencies['react-native'];
  
  if (rnVersion) {
    const version = rnVersion.replace(/[^0-9.]/g, '');
    const major = parseInt(version.split('.')[0]);
    const minor = parseInt(version.split('.')[1]);
    
    if (major >= 0 && minor >= 80) {
      console.log(`✅ React Native 版本: ${rnVersion} (新架构稳定版本)`);
      score += 10;
    } else if (major >= 0 && minor >= 70) {
      console.log(`⚠️  React Native 版本: ${rnVersion} (支持新架构但建议升级)`);
      score += 5;
    } else {
      console.log(`❌ React Native 版本过低: ${rnVersion}`);
      console.log('   新架构需要 React Native 0.70+');
    }
  }
}

// 5. 生成报告
console.log('\n📊 系统要求检查报告');
console.log('='.repeat(50));
console.log(`总分: ${score}/${totalScore}`);

if (score >= 90) {
  console.log('🎉 系统要求状态: 优秀');
  console.log('   你的项目完全满足新架构要求！');
} else if (score >= 70) {
  console.log('👍 系统要求状态: 良好');
  console.log('   基本满足要求，建议优化一些配置。');
} else if (score >= 50) {
  console.log('⚠️  系统要求状态: 需要改进');
  console.log('   部分满足要求，需要升级配置。');
} else {
  console.log('❌ 系统要求状态: 不满足');
  console.log('   需要大量升级才能支持新架构。');
}

// 6. 提供建议
console.log('\n💡 优化建议:');

if (score < 90) {
  console.log('1. 确保 Android minSdkVersion >= 24 (RN 0.75+)');
  console.log('2. 确保 iOS MinimumOSVersion >= 15.1 (RN 0.80+)');
  console.log('3. 升级到 React Native 0.80+');
  console.log('4. 使用 Node.js 18+');
  console.log('5. 启用新架构配置');
}

// 7. 设备覆盖率信息
console.log('\n📱 设备覆盖率信息:');
console.log('Android API 24+ (7.0+): 96.5% ⭐ RN 0.75+ 最低要求');
console.log('Android API 26+ (8.0+): 92.1% ⭐ 推荐版本');
console.log('iOS 15.1+: 95% ⭐ RN 0.80+ 最低要求');
console.log('iOS 16.0+: 90% 推荐版本');

console.log('\n📖 更多信息请查看: docs/React Native新架构版本兼容性分析.md');

// 辅助函数
function getAndroidVersion(apiLevel) {
  const versions = {
    21: '5.0 (Lollipop)',
    22: '5.1 (Lollipop)',
    23: '6.0 (Marshmallow)',
    24: '7.0 (Nougat)',
    25: '7.1 (Nougat)',
    26: '8.0 (Oreo)',
    27: '8.1 (Oreo)',
    28: '9.0 (Pie)',
    29: '10.0 (Q)',
    30: '11.0 (R)',
    31: '12.0 (S)',
    32: '12.0 (S)',
    33: '13.0 (T)',
    34: '14.0 (U)',
    35: '15.0 (V)'
  };
  return versions[apiLevel] || `API ${apiLevel}`;
} 