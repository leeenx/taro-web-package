"use strict";(wx["webpackJsonp"]=wx["webpackJsonp"]||[]).push([[592],{6634:function(n,t,e){e.d(t,{FZ:function(){return v},G3:function(){return w},dt:function(){return p},ew:function(){return s},rV:function(){return m}});var r=e(9439),o=e(1002),c=e(2954),a=e.n(c),u=e(8707),i=0,s=function(){return"".concat(i++)},f={},l=function(){var n=(0,c.getCurrentPages)(),t=n.length-1;return n[t]},v=function(n){f[n]=l()},d=function(n){return f[n]},p=function(n){var t=d(n);return null===t||void 0===t?void 0:t.options},g=function(n,t,e){var c=u.globalScope.defaultContainer,a=u.globalScope.headlessContainer,i=e?a:c;if(!i)throw new Error("\u300cheadlessContainer\u300d\u6216\u300cdefaultContainer\u300d\u672a\u6307\u5b9a\u8def\u7531");var s=w(n),f="".concat(i,"?route=").concat(s);if(t&&"object"===(0,o.Z)(t)){var l="";l=Object.entries(t).map((function(n){var t=(0,r.Z)(n,2),e=t[0],c=t[1],a=(0,o.Z)(c);return["number","string","boolean"].includes(a)?"".concat(e,"=").concat(c):"object"===a?"".concat(e,"=").concat(encodeURIComponent(JSON.stringify(c))):"".concat(e,"=")})).join("&"),l&&(f="".concat(i,"?route=").concat(s,"&").concat(l))}return f},b=function(n,t,e){return new Promise((function(r,o){var c=e||{},u=c.replace,i=void 0!==u&&u,s=c.headless,f=void 0!==s&&s,l={url:g(n,t,f),success:function(){return r(void 0)},fail:function(){o(new Error("navigate \u5931\u8d25: ".concat(JSON.stringify({route:n,params:t,replace:i}))))}};i?a().redirectTo(l):a().navigateTo(l)}))},m=function(n){var t=p(n),e=t.route,r=t.page,o=d(n),c=e;(0,u.registerToScope)(c,{pageId:n,pageName:r,nameSpace:c,currentPage:o,createRoute:g,navigate:b,getCurrentPage:function(){return o},getCurrentParams:function(){return null===o||void 0===o?void 0:o.options},getCurrentParam:function(n){var t;return null===o||void 0===o||null===(t=o.options)||void 0===t?void 0:t[n]}})},w=function(n){var t=u.globalScope.dslBase,e=n;return t&&!/^http(s?):/.test(n)&&(e="".concat(t).concat(n)),e}}}]);