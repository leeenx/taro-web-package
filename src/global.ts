import Taro from "@tarojs/taro";
import { getCurrentPages, Page } from "@tarojs/taro";
//@ts-ignore
import { registerToScope, globalScope } from 'kbs-dsl-resolver';

let pageIndex: number = 0;

// 返回 pageId
export const getPageId = () => `${pageIndex++}`;

// 页面收集器
const PAGE_COLLECTION: Record<string, Page> = {};

// 返回最顶层 page
export const getLastPage = () => {
  const pages = getCurrentPages();
  const lastIndex = pages.length - 1;
  return pages[lastIndex];
};

// 更新页面收集器
export const updatePageCollection = (pageId: string) => {
  PAGE_COLLECTION[pageId] = getLastPage();
};

export const getPageById = (pageId: string) => PAGE_COLLECTION[pageId];

export const getParamsById = (pageId: string) => {
  const page = getPageById(pageId);
  return page?.options;
};

// 返回微信小程的路由
export const createRoute = (route: string, params: any, headless: boolean) => {
  const {
    defaultContainer,
    headlessContainer
  } = globalScope;
  const url = headless ? headlessContainer : defaultContainer;
  if (!url) {
    // 表示「headlessContainer」&「defaultContainer」没有默认值
    throw new Error('「headlessContainer」或「defaultContainer」未指定路由');
  }
  const page = getDslUrl(route);
  let wxRoute: string = `${url}?route=${page}`;
  if (params && typeof params === 'object') {
    let paramsStr = '';
    paramsStr = Object.entries(params)
      .map(([key, value]) => {
        const type = typeof value;
        if (['number', 'string', 'boolean'].includes(type)) {
          return `${key}=${value}`;
        }
        if (type === 'object') {
          return `${key}=${encodeURIComponent(JSON.stringify(value))}`
        }
        return `${key}=`;
      })
      .join('&');
    if (paramsStr) {
      wxRoute = `${url}?route=${page}&${paramsStr}`;
    }
  }
  /**
   * 必传参数：pageNameSpace
   * pId 是用来区分页面栈里的路由的。因为多路由使用同一页面，不会产生新的页面对象；
   * 即 Page 方法只会在启动APP 的时候被调用，创建页面路由的时候不会被再次调用，需要一个额外的
   * 唯一值来做页面路由标记。每个页面路由需要一个独立的作用域，默认使用 pId
   */
  // return `${wxRoute}&pId=${Date.now()}`;
  return wxRoute;
};

interface NavigateConfig {
  replace: boolean;
  headless: boolean;
}

export const navigate = (
  route: string,
  params: any,
  config?: NavigateConfig
): Promise<void> => new Promise((resolve, reject) => {
  const { replace = false, headless = false } = config || {};
  const options = {
    url: createRoute(route, params, headless),
    success: () => resolve(void 0),
    fail() {
      reject(new Error(`navigate 失败: ${JSON.stringify({ route, params, replace })}`));
    }
  };
  if (replace) {
    Taro.redirectTo(options);
  } else {
    Taro.navigateTo(options);
  }
});

/**
 * 按 pageId 注册
 * 但是事实上是按 nameSpace 注册的，但是在页面预解析的时候，
 * 会把注册进去的方法拷贝起来存放到页面级作用域中。请注意，调
 * 用些方法后，会立即调用页面预解析方法，保证按页面级注册方法
 */
export const registerById = (pageId: string) => {
  const { route, page } = getParamsById(pageId);
  const currentPage = getPageById(pageId);
  const nameSpace: string = route;
  registerToScope(nameSpace, {
    pageId,
    pageName: page,
    nameSpace,
    currentPage,
    createRoute,
    navigate,
    getCurrentPage: () => currentPage,
    getCurrentParams: () => currentPage?.options,
    getCurrentParam: (key: string) => currentPage?.options?.[key]
  });
};

// 返回 dsl 地址
export const getDslUrl = (route: string) => {
  const { dslBase } = globalScope;
  let page = route;
  if (dslBase && !/^http(s?):/.test(route)) {
    page = `${dslBase}${route}`
  }
  return page;
};
