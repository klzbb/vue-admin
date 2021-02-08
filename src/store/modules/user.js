import { login, logout, getUserInfo } from '@/api/index.js';
import { getSession, setSession } from '@/utils/sessionUtil.js';
import router, { resetRouter } from '@/router';

const state = {
  loginStatus: '0', // 0-未登录 1-已登录
  userInfo: {},
  name: '',
  avatar: '',
  introduction: '',
  roles: []
};

const mutations = {
  SET_LOGIN_STATUS: (state, loginStatus) => {
    setSession('LOGIN_STATUS', loginStatus);
    state.loginStatus = loginStatus;
  },
  SET_USER_INFO: (state, userInfo) => {
    setSession('USER_INFO', userInfo);
    state.userInfo = userInfo;
  }
};

const actions = {

  // user login
  login({ commit }, userInfo) {
    const { username, password, imageCode } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, imageCode }).then(response => {
        commit('SET_LOGIN_STATUS', '1');
        commit('SET_USER_INFO', response.data.data.user); // 保存用户数据
        resolve(response);
      }).catch(error => {
        reject(error);
      });
    });
  },

  // get user info
  getUserInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo(state.token).then(response => {
        commit('SET_USER_INFO', response.data.data);
        resolve(response);
      }).catch(error => {
        reject(error);
      });
    });
  },

  // user logout
  logout({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('SET_LOGIN_STATUS', '0');
        commit('SET_USER_INFO', {});
        commit('permission/RESET_ROUTER', null, { root: true });
        resetRouter();
        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true });

        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
