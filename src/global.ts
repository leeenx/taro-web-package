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
