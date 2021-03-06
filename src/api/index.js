/*
 * @Descripttion: DOP
 * @version: 1.0.0
 * @Author: Author
 * @Date: 2020-07-21 16:35:03
 * @LastEditors: konglingzhan
 * @LastEditTime: 2020-08-20 10:16:59
 */
import axios from '@/utils/request.js';

/* 把对象转化为formData表单格式 */
const formUtil = (obj) => {
  const formData = new FormData();
  if (!obj || Object.keys(obj).length === 0) { return formData; }
  for (const key in obj) {
    formData.append(key, obj[key]);
  }
  return formData;
};

// 部门树
export const deptTree = params => axios({
  method: 'post',
  url: '/app/dept/tree',
  data: params
});

// 添加部门
export const deptAdd = params => axios({
  method: 'post',
  url: '/app/dept/add',
  data: formUtil(params)
});

// 删除部门
export const deptDel = params => axios({
  method: 'post',
  url: '/app/dept/delById',
  params
});

// 更新部门
export const deptUpdate = (params) => axios({
  url: '/app/dept/update',
  method: 'post',
  data: formUtil(params)
});

// 注册用户
export const register = (params) => axios({
  url: '/app/register',
  method: 'post',
  data: formUtil(params)
});

// 更新用户
export const updateById = (params) => axios({
  url: '/app/user/updateById',
  method: 'post',
  data: formUtil(params)
});

// 用户列表
export const userList = (params) => axios({
  url: '/app/user/list',
  method: 'post',
  data: formUtil(params)
});

// 所有用户
export const userAll = (params) => axios({
  url: '/app/userAll',
  method: 'post',
  data: formUtil(params)
});

// 用户删除
export const delUserById = (params) => axios({
  url: '/app/user/delById',
  method: 'post',
  data: formUtil(params)
});

// 登录
export const login = params => axios({
  url: '/app/login',
  method: 'post',
  data: formUtil(params)
});

// 登出
export const logout = () => axios({
  url: '/app/logout',
  method: 'get'
});

// 菜单树
export const menuTree = () => axios({
  url: '/app/menu/tree',
  method: 'post'
});

// 新增菜单
export const menuAdd = params => axios({
  url: '/app/menu/add',
  method: 'post',
  data: formUtil(params)
});

// 更新菜单
export const menuUpdate = params => axios({
  url: '/app/menu/update',
  method: 'post',
  data: formUtil(params)
});

// 查询菜单Level
export const findMenuLevelById = params => axios({
  url: '/app/menu/findLevelById',
  method: 'post',
  data: formUtil(params)
});

// 删除菜单
export const menuDel = params => axios({
  url: '/app/menu/del',
  method: 'post',
  data: formUtil(params)
});

// 获取用户信息
export const getUserInfo = () => axios({
  url: '/app/user/getUserInfo',
  method: 'post'
});

// 角色add
export const roleAdd = (params) => axios({
  url: '/app/role/add',
  method: 'post',
  data: formUtil(params)
});

// 角色delete
export const roleDel = (params) => axios({
  url: '/app/role/del',
  method: 'post',
  data: formUtil(params)
});

// 角色list
export const roleList = (params) => axios({
  url: '/app/role/list',
  method: 'post',
  data: formUtil(params)
});

// 角色update
export const roleUpdate = (params) => axios({
  url: '/app/role/update',
  method: 'post',
  data: formUtil(params)
});

// 角色权限树
export const roleTree = (params) => axios({
  url: '/app/role/tree',
  method: 'post',
  data: formUtil(params)
});

// 保存角色权限菜单
export const roleMenuSave = (params) => axios({
  url: '/app/roleMenu/save',
  method: 'post',
  data: formUtil(params)
});

// 用户权限路由
export const getPermissionMenusByUid = () => axios({
  url: '/app/menu/getPermissionMenusByUid',
  method: 'post'
});

// 图形验证码
export const codeImage = () => axios({
  url: '/app/code/image',
  method: 'get'
});
