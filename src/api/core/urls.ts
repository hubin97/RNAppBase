// API 路径配置
export const API = {
  // 首页相关
  home: {
      banner: '/banner/json',
      articleTop: '/article/top/json',
      articleList: '/article/list', // /0/json
  },

  // 项目相关
  project: {
      tree: '/project/tree/json',
      list: '/project/list', // /1/json?cid=294
  },

  // 体系相关
  tree: {
      list: '/tree/json',
      articleList: '/article/list', // /0/json?cid=60
  },

  // 公众号相关
  wxarticle: {
      chapters: '/wxarticle/chapters/json',
      list: '/wxarticle/list', // /408/1/json
      search: '/wxarticle/list', // /405/1/json?k=Java
  },

  // 导航相关
  navi: {
      list: '/navi/json',
      articleList: '/article/list', // /0/json?cid=60&order_type=1
  },

  // 工具相关
  tool: {
      list: '/tools/list/json',
  },
};

// 导出完整 URL
export const bannerUrl = API.home.banner;
export const articleTopUrl = API.home.articleTop;
export const articleListUrl = API.home.articleList;

export const projectUrl = API.project.tree;
export const projectListUrl = API.project.list;

export const treeUrl = API.tree.list;
export const treeListUrl = API.tree.articleList;

export const wxarticleUrl = API.wxarticle.chapters;
export const wxarticleListUrl = API.wxarticle.list;
export const wxarticleSearchUrl = API.wxarticle.search;

export const chapterUrl = API.navi.list;
export const chapterListUrl = API.navi.articleList;

export const toolUrl = API.tool.list;