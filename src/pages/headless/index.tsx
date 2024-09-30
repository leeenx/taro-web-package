import { useEffect, useCallback, useRef, useState } from 'react';
import { showLoading, showToast, hideLoading } from '@tarojs/taro';
//@ts-ignore
import resolve, { registerToGlobleScope, registerToScope, recyleMemoCache, globalScope } from 'kbs-dsl-resolver';
//@ts-ignore
import load, { watch, fromHtml } from 'kbs-dsl-loader';
import {
  getPageId,
  getParamsById,
  registerById,
  updatePageCollection,
  getDslUrl
} from '@/global';
import type { JSXElementConstructor } from 'react';

import './index.scss';

export default function Index() {
  const that = useRef<Record<string, any>>({});
  const [currentComponent, setCurrentComponent] = useState<JSXElementConstructor<any> | null>(null);
  const [status, setStatus] = useState<string>('loading');
  const {
    loadingComponent = null,
    errorComponent = null
  } = globalScope;
  const handleInit = useCallback(async () => {
    if (!loadingComponent) {
      // 默认情况下，使用 showLoading 展示
      showLoading({ title: '加载中...' });
    }
    const pageId = getPageId();
    updatePageCollection(pageId);
    const { route, page } = getParamsById(pageId);
    let dslUrl: string = route && getDslUrl(decodeURIComponent(route));
    const {
      enableCache,
      cacheCount,
      alwaysFromHtml,
      cacheMaxSize = 50, // 默认 50M
    } = globalScope;
    if (alwaysFromHtml && dslUrl) {
      dslUrl = await fromHtml(dslUrl);
    }
    if (!dslUrl) {
      showToast({
        title: '找不到 dslUrl!',
        icon: 'error',
        duration: 5000
      });
      setStatus('error');
      return;
    }
    // 加载 dslJson
    const dslJson = await load(dslUrl, enableCache, cacheCount, cacheMaxSize)
    // 按页面注册方法
    registerById(pageId);
    const resolvedModule = resolve(dslJson, route, enableCache, cacheCount, (memoCacheStackItem: any) => {
      Object.assign(that.current, {
        nameSpace: route,
        memoCacheStackItem
      });
    });
    setCurrentComponent(resolvedModule[page || 'default']);
    setStatus('success');
    hideLoading();
  }, []);
  useEffect(() => {
    handleInit();
    return () => {
      // 回收缓存
      recyleMemoCache(that.current.nameSpace, that.current.memoCacheStackItem);
    };
  }, []);
  const MyComponent = currentComponent!;
  switch(status) {
    case 'loading':
      return loadingComponent;
    case 'error':
      return errorComponent;
    default:
      return <MyComponent />;
  }
};
