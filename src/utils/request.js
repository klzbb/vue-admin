/*
 * @Descripttion: DOP
 * @version: 1.0.0
 * @Author: Author
 * @Date: 2020-07-21 14:10:12
 * @LastEditors: konglingzhan
 * @LastEditTime: 2020-08-12 13:45:52
 */
import axios from 'axios';
import { MessageBox, Message } from 'element-ui';
import store from '@/store';
import { getToken } from '@/utils/auth';
import router from '@/router/index.js';
// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_SERVICE_URL // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 20000 // request timeout
  validateStatus: function(status) {
    return status >= 200 && status < 400; // 默认的
  }
});

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken();
    }
    return config;
  },
  error => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  res => {
    const { code } = res.data;
    const condition = [0];
    if (condition.includes(code)) {
      return res;
    } else if (code === 401) {
      store.dispatch('user/logout');
      router.push({ path: '/login' });
      Message({
        message: '登录态失效',
        type: 'error',
        duration: 5 * 1000
      });
      return Promise.reject(res.data.code);
    } else {
      Message({
        message: res.data.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      });
      return Promise.reject(res.data.code);
    }
  },
  error => {
    console.log('err=', { error }); // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
