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
  store.commit('permission/SET_ROUTES', []);
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
      const { permission_routes } = store.getters;
      if (permission_routes && permission_routes.length > 0) {
        next();
      } else {
        const res = await getPermissionMenusByUid();
        const accessRoutes = res.data.data;
        store.commit('permission/SET_ROUTES', accessRoutes);
        router.addRoutes(accessRoutes);
        console.log('kkkk=', store.getters.permission_routes);
        next({ ...to, replace: true });
      }
    }
  }
  // // set page title
  // document.title = getPageTitle(to.meta.title)

  // // determine whether the user has logged in
  // const hasToken = getToken()

  // if (hasToken) {
  //   if (to.path === '/login') {
  //     // if is logged in, redirect to the home page
  //     next({ path: '/' })
  //     NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
  //   } else {
  //     // determine whether the user has obtained his permission roles through getInfo
  //     const hasRoles = store.getters.roles && store.getters.roles.length > 0
  //     if (hasRoles) {
  //       next()
  //     } else {
  //       try {
  //         // get user info
  //         // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
  //         const { roles } = await store.dispatch('user/getInfo')

  //         // generate accessible routes map based on roles
  //         const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

  //         // dynamically add accessible routes
  //         router.addRoutes(accessRoutes)

  //         // hack method to ensure that addRoutes is complete
  //         // set the replace: true, so the navigation will not leave a history record
  //         next({ ...to, replace: true })
  //       } catch (error) {
  //         // remove token and go to login page to re-login
  //         await store.dispatch('user/resetToken')
  //         Message.error(error || 'Has Error')
  //         next(`/login?redirect=${to.path}`)
  //         NProgress.done()
  //       }
  //     }
  //   }
  // } else {
  //   /* has no token*/

  //   if (whiteList.indexOf(to.path) !== -1) {
  //     // in the free login whitelist, go directly
  //     next()
  //   } else {
  //     // other pages that do not have permission to access are redirected to the login page.
  //     next(`/login?redirect=${to.path}`)
  //     NProgress.done()
  //   }
  // }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
