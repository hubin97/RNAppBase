import { provider } from '@/api/core/provider';
import { bannerUrl, articleTopUrl, articleListUrl } from '../core/urls';
import type { Banner, Article, PageData } from './homeTypes';

// 首页相关接口
export const homeApi = {
    // 获取轮播图
    getBanner: () => provider.get<Banner[]>(bannerUrl),
    
    // 获取置顶文章
    getTopArticles: () => provider.get<Article[]>(articleTopUrl),
    
    // 获取文章列表 `注意页码从0开始, page_size 控制分页数量，取值为[1-40]`
    getArticleList: (page: number, pageSize: number) => 
        provider.get<PageData<Article>>(`${articleListUrl}/${page}/json?page_size=${pageSize}`)
};