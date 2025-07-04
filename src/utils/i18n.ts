/**
 * I18n 工具类使用流程：
 * 
 * 1. 取文案：
 *    import I18n from '@/utils/i18n';
 *    I18n.t('welcome');
 * 
 * 2. 切换语言：
 *    I18n.changeLanguage('en'); // 切换到英文
 *    I18n.changeLanguage('zh'); // 切换到中文
 * 
 * 3. 获取当前语言：
 *    I18n.getLanguage();
 * 
 * 4. （可选）如需组件自动刷新，使用 useTranslation hook：
 *    import { useTranslation } from 'react-i18next';
 *    const { t, i18n } = useTranslation();
 *    t('welcome');
 *    i18n.changeLanguage('en');
 * 
 * 5. 扩展语言：
 *    在 src/locales/ 目录下维护各自的 json 文件。
 */

// 解决 TypeScript 导入 json 文件的类型问题
// @ts-ignore
import en from '@/locales/output/en.json';
// @ts-ignore
import zh from '@/locales/output/zh.json';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

const resources = {
  en: { translation: en },
  zh: { translation: zh },
};

// 获取设备语言
const locales = RNLocalize.getLocales();
const deviceLanguage = locales[0]?.languageCode || 'en';

// 初始化 i18n
if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: deviceLanguage, // 自动用系统语言
      fallbackLng: 'zh',
      interpolation: {
        escapeValue: false, // react 已经安全转义
      },
    });
}

// 封装工具类接口
const I18n = {
  t: (key: string, options?: any) => {
    const result = i18n.t(key, options);
    return typeof result === 'string' ? result : String(result);
  },
  changeLanguage: (lng: string) => i18n.changeLanguage(lng),
  getLanguage: () => i18n.language,
  getI18n: () => i18n,
};

export default I18n; 