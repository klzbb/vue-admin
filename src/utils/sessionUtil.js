/*
 * @Descripttion: DOP
 * @version: 1.0.0
 * @Author: Author
 * @Date: 2020-08-17 09:07:57
 * @LastEditors: konglingzhan
 * @LastEditTime: 2020-08-18 10:52:34
 */
// set sessionStorage
export const setSession = (key, data) => {
  if (!key) throw new Error("setSession's key can't be null");
  if (!data) throw new Error("setSession's data can't be null");

  if (data instanceof Object) {
    window.sessionStorage.setItem(key, JSON.stringify(data));
  } else {
    window.sessionStorage.setItem(key, data);
  }
};

// get sessionStorage
export const getSession = (key, isJson = false) => {
  if (!key) throw new Error("getSession's key can't be null");
  if (isJson) {
    return JSON.parse(window.sessionStorage.getItem(key));
  } else {
    return window.sessionStorage.getItem(key);
  }
};

// set localStorage
export const setLocal = (key, data) => {
  if (!key) throw new Error("localStorage's key can't be null");
  if (!data) throw new Error("localStorage's data can't be null");
  if (data instanceof Object) {
    window.localStorage.setItem(key, JSON.stringify(data));
  } else {
    window.localStorage.setItem(key, data);
  }
};

// get localStorage
export const getLocal = (key, isJson = false) => {
  if (!key) throw new Error("localStorage's key can't be null");
  if (!isJson) {
    return window.localStorage.getItem(key);
  } else {
    return JSON.parse(window.localStorage.getItem(key));
  }
};
