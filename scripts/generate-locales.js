/**
 * 从 locales.xlsx 生成多语言 JSON 文件
 * 
 * Excel 格式要求：
 * | key      | zh        | en      |
 * |----------|-----------|---------|
 * | welcome  | 欢迎      | Welcome |
 * | login    | 登录      | Login   |
 * 
 * 使用方法：
 * 1. 将 locales.xlsx 放在项目根目录
 * 2. 运行: node scripts/generate-locales.js
 * 3. 自动生成 src/locales/zh.json, src/locales/en.json 等文件
 */


const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

// === 配置区 ===
// Excel 输入文件路径（相对或绝对路径均可）
const EXCEL_PATH = path.resolve(__dirname, '../src/locales/locales.xlsx');
// JSON 输出目录
const OUTPUT_DIR = path.resolve(__dirname, '../src/locales/output');
// =============

try {
  // 读取 Excel 文件
  if (!fs.existsSync(EXCEL_PATH)) {
    console.error('❌ 未找到 locales.xlsx 文件，请确保文件在项目根目录');
    process.exit(1);
  }

  const workbook = xlsx.readFile(EXCEL_PATH);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);

  if (data.length === 0) {
    console.error('❌ Excel 文件为空或格式不正确');
    process.exit(1);
  }

  // 获取所有语言列（除 key 列）
  const langs = Object.keys(data[0]).filter(key => key !== 'key');
  
  if (langs.length === 0) {
    console.error('❌ 未找到语言列，请确保第一列是 key，其他列是语言代码');
    process.exit(1);
  }

  console.log(`📝 检测到语言: ${langs.join(', ')}`);

  // 按语言分组数据
  const result = {};
  langs.forEach(lang => {
    result[lang] = {};
  });

  // 处理每一行数据
  data.forEach((row, index) => {
    if (!row.key) {
      console.warn(`⚠️  第 ${index + 1} 行缺少 key，已跳过`);
      return;
    }

    langs.forEach(lang => {
      result[lang][row.key] = row[lang] || '';
    });
  });

  // 创建输出目录
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 创建目录: ${OUTPUT_DIR}`);
  }

  // 生成各语言 JSON 文件
  langs.forEach(lang => {
    const filePath = path.join(OUTPUT_DIR, `${lang}.json`);
    const content = JSON.stringify(result[lang], null, 2);
    fs.writeFileSync(filePath, content, { encoding: 'utf8' });
    console.log(`✅ 已生成: ${lang}.json (${Object.keys(result[lang]).length} 个翻译)`);
  });

  console.log(`\n🎉 多语言文件生成完成！`);
  console.log(`📂 输出目录: ${OUTPUT_DIR}`);

} catch (error) {
  console.error('❌ 生成失败:', error.message);
  process.exit(1);
} 