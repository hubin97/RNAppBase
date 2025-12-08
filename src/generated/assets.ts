// 自动生成文件，请勿手写
// 如果你新增了资源文件，运行：  node scripts/generate-assets.js

export const Assets = {
  fonts: {
    AntDesign: require('../../assets/fonts/AntDesign.ttf'),
    FontAwesome: require('../../assets/fonts/FontAwesome.ttf'),
    Roboto_Bold: require('../../assets/fonts/Roboto-Bold.ttf'),
  },
  icons: {
    ic_coins: require('../../assets/icons/ic_coins.svg'),
    ic_done: require('../../assets/icons/ic_done.svg'),
    ic_settings: require('../../assets/icons/ic_settings.svg'),
  },
  lotties: {
    moment_christmas_like: require('../../assets/lotties/moment_christmas_like.json'),
    moment_christmas_snow: require('../../assets/lotties/moment_christmas_snow.json'),
    moment_christmas_tree: require('../../assets/lotties/moment_christmas_tree.json'),
  },
  webp: {
    icon_webp_gift_popup: require('../../assets/webp/icon_webp_gift_popup.webp'),
  },
} as const;

export type AssetKeys = keyof typeof Assets;
