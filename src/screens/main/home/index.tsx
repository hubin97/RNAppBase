import React, { useState } from 'react';
import I18n from '@/utils/i18n';
import Icon from '@/components/ui/Icon';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { FlatList, TouchableOpacity, ListRenderItem, Image } from 'react-native';
import { homeApi } from "@/api/home/homeApi";
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { Carousel } from '@ant-design/react-native';
import { Article, PageData } from "@/api/home/homeTypes";
import { useThemeColors } from '@/hooks/useThemeColor';
import { decodeHtml } from '@/utils/string-utils';
import { Skeleton_Home } from '../../../utils/skeletons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/config/paramLists';
import { ROUTES } from "@/navigation/config/routes";
import { styles } from "./type";

const HomeScreen = () => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const themeColor = useThemeColors();
  const pageSize: number = 20;
  const [page, setPage] = useState(0);
  const [naviOpacity, setNaviOpacity] = useState(0);

  // 获取 banner 数据
  const {
    data: bannerData,
    isLoading: bannerLoading,
    error: bannerError,
  } = useQuery({
    queryKey: ['homeApi.getBanner'],
    queryFn: homeApi.getBanner,
    staleTime: 1000 * 60 * 3, // 3分钟缓存
  });

  // 获取置顶文章
  const {
    data: topArticles,
    isLoading: topArticlesLoading,
    error: topArticlesError,
  } = useQuery({
    queryKey: ['homeApi.getTopArticles'],
    queryFn: homeApi.getTopArticles,
    staleTime: 1000 * 60 * 3,
  });

  // 获取文章列表（分页）
  const {
    data: articleListPages,
    isLoading: articleListLoading,
    error: articleListError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery<PageData<Article>, Error>({
    queryKey: ['homeApi.getArticleList', pageSize],
    queryFn: ({ pageParam = 0 }: { pageParam?: unknown }) => homeApi.getArticleList(Number(pageParam), pageSize),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.curPage < lastPage.pageCount) {
        return lastPage.curPage;
      }
      return undefined;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 3,
    placeholderData: (prev) => prev,
  });

  // 合并所有分页数据
  // 合并置顶文章和分页文章，置顶文章排在最前面
  const articles = [
    ...(topArticles ?? []),
    ...(articleListPages?.pages?.flatMap(page => page.datas) ?? [])
  ];

  // 下拉刷新
  const onRefresh = () => {
    refetch();
  };

  // 上拉加载更多
  const onEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const _renderCarousel = (
    <Carousel autoplay infinite style={styles.carousel} >
      { 
      (bannerData?.length ?? 0) > 0 && bannerData?.map(item => {
        return (
          <TouchableOpacity key={item.id} activeOpacity={0.7} onPress={() => {
            navigation.navigate(ROUTES.WebView, { title: decodeHtml(item.title), url: item.url });
          }}>
            <Image style={{width: '100%', height: '100%'}} source={{uri: item.imagePath ?? ''}}/>
          </TouchableOpacity>
        );
      }) 
      }
    </Carousel>
  )

  const _renderItem: ListRenderItem<Article>  = ({ item }) => {
    return (
      <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        navigation.navigate(ROUTES.WebView, { title: decodeHtml(item.title), url: item.link });
      }}>
      <ThemedView style={[styles.itemWrapper ]}>
        <Icon size={20} name='chevron-forward' color={ themeColor.text } style={{ marginRight: 15 }}/>
        <ThemedView style={styles.contentStyle}>
          <ThemedText type='title' style={{ fontSize: 15 }}>{ decodeHtml(item.title) }</ThemedText>
          <ThemedView
            style={styles.bottomStyle}>
            <ThemedText type='default' style={{ fontSize: 12 }}>更新时间: {item.niceDate}</ThemedText>
            <ThemedText type='default' style={{ fontSize: 12 }}>{ item.author && `作者: ${item.author}` }</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
    );
  };

  const _renderSeparator = () => (
    <ThemedView style={{ height: 0.5, backgroundColor: themeColor.separator, marginLeft: 16 }} />
  );

  const _onScroll = (e: any) => {
    let originY = e.nativeEvent.contentOffset.y;
    // console.log('originY>>', originY);
    if (originY <= 0) {
      naviOpacity && setNaviOpacity(0)
    } else if (originY <= 44) {
      setNaviOpacity(originY/44)
    } else if (originY > 44) {
      naviOpacity < 1 && setNaviOpacity(1)
    } 
  }

  // articleListLoading: 仅在初次加载时为 true。
  // isRefetching：下拉刷新时为 true。
  // isFetchingNextPage：分页加载（上拉加载更多）时为 true。
  if ((articleListLoading || isRefetching) && !isFetchingNextPage) {
    return <Skeleton_Home />;
  }

  return (
    <ThemedView style={styles.container}> 
      <ThemedView style={[ styles.naviWrapper, { height: insets.top + 44, borderBottomColor: themeColor.separator, opacity: naviOpacity }]}>
        <ThemedView style={[ styles.naviItem, { marginTop: insets.top } ]}>
            <ThemedText type='title' style={{ fontSize: 18 }} >{I18n.t('home')}</ThemedText>
        </ThemedView>
      </ThemedView>
      <FlatList
        keyExtractor={(item: Article, index: number) => `${item.id}-${index}`}
        style={[styles.flatlist, { marginTop: insets.top }]}
        data={articles}
        renderItem={_renderItem}
        initialNumToRender={10}
        ListHeaderComponent={_renderCarousel}
        ItemSeparatorComponent={_renderSeparator}
        onScroll={_onScroll}
        onEndReachedThreshold={0.5}
        refreshing={isRefetching}
        onRefresh={onRefresh}
        onEndReached={onEndReached}
      />
    </ThemedView>
  );
}

export default HomeScreen; 