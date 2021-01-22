/*
 * @Descripttion: DOP
 * @version: 1.0.0
 * @Author: Author
 * @Date: 2020-07-21 14:10:12
 * @LastEditors: konglingzhan
 * @LastEditTime: 2020-07-21 17:31:10
 */
import router from './router';
import store from './store';
import { Message } from 'element-ui';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import { getToken } from '@/utils/auth'; // get token from cookie
import getPageTitle from '@/utils/get-page-title';
import { getPermissionMenusByUid } from '@/api/index.js';
NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ['/login', '/auth-redirect']; // 白名单地址

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start();
  const { loginStatus } = store.getters;
  // store.commit('permission/SET_ROUTES', []);
  if (loginStatus === '0') {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  } else {
    if (to.path === '/login') {
      next({ path: '/' });
    } else {
      next();
      console.log('permission_routes=', permission_routes);
      const { permission_routes } = store.getters;
      if (permission_routes && permission_routes.length) {
        next();
      } else {
        const res = await getPermissionMenusByUid();
        const accessRoutes = filterAsyncRoutes(res.data.data);
        store.commit('permission/SET_ROUTES', accessRoutes);
        router.addRoutes(accessRoutes);
        next({ ...to, replace: true });
      }
    }
  }
});

function filterAsyncRoutes(routes) {
  return routes.filter(route => {
    const { name } = route;
    if (name) {
      switch (name) {
        case 'Layout':
          route.component = () => import('@/layout/index.vue');
          break;
        default:
          route.component = () => import(`@/views${route.component}.vue`);
          // route.component = view(route.component);
          break;
      }
      if (route.children && route.children.length) {
        filterAsyncRoutes(route.children);
      }
      return true;
    }
  });
}

// function view(path) {
//   console.log(`@/views${path}.vue`);
//   return (resolve) => require([`./views${path}.vue`], resolve);
// }

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
