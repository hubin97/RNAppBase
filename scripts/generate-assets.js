/**
 * 
 * 脚本：扫描 assets 目录，生成资源文件映射到 src/generated/assets.ts
 * 用法：node scripts/generate-assets.js
 * 支持的资源文件后缀：.png, .jpg, .jpeg, .svg, .webp, .json
 * 
 * 1) 推荐最干净的结构：
 * assets/
   icons/        ← SVG（首选）
   images/       ← WebP（大图）+ PNG（少量小图）
   lottie/       ← 动效
 * 
 * 2) 假设 assets 目录结构如下：
 *
 ├─ assets
 │   ├─ images
 │   │   ├─ home.png
 │   │   ├─ back.png
 │   ├─ icons
 │       ├─ add.png
 │       ├─ delete.png
 └─ scripts
     └─ generate-assets.js

 * 3) 生成的 assets.ts 文件内容示例：
    export const Assets = {
    images: {
        home: require('../../assets/images/home.png'),
        back: require('../../assets/images/back.png'),
    },
    icons: {
        add: require('../../assets/icons/add.png'),
        delete: require('../../assets/icons/delete.png'),
    },
    } as const;
 */

const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.resolve(__dirname, '../src/assets');
const OUTPUT = path.resolve(__dirname, '../src/generated/assets.ts');

// 合法的资源后缀
const VALID_EXT = ['.png', '.jpg', '.jpeg', '.svg', '.webp', '.json', '.ttf'];

function scanDir(dir, base) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  let result = {};

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const relPath = path.relative(base, fullPath);

    if (item.isDirectory()) {
      result[item.name] = scanDir(fullPath, base);
    } else {
      const ext = path.extname(item.name);
      if (!VALID_EXT.includes(ext)) continue;

      const key = path.basename(item.name, ext).replace(/[^a-zA-Z0-9]/g, '_');
      result[key] = `require('../../assets/${relPath.replace(/\\/g, '/')}')`;
    }
  }
  return result;
}

function generateTS(obj, indent = 2) {
  let lines = [];
  const space = ' '.repeat(indent);

  for (const key in obj) {
    const value = obj[key];
    if (typeof value === 'string') {
      lines.push(`${space}${key}: ${value},`);
    } else {
      lines.push(`${space}${key}: {`);
      lines.push(generateTS(value, indent + 2));
      lines.push(`${space}},`);
    }
  }
  return lines.join('\n');
}

function main() {
  const tree = scanDir(ASSETS_DIR, ASSETS_DIR);

  const tsContent = `// 自动生成文件，请勿手写
// 如果你新增了资源文件，运行：  node scripts/generate-assets.js

export const Assets = {
${generateTS(tree)}
} as const;

export type AssetKeys = keyof typeof Assets;
`;

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, tsContent, 'utf8');

  console.log(`✔ 生成成功：${OUTPUT}`);
}

main();
