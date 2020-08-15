/*
 * @Descripttion: DOP
 * @version: 1.0.0
 * @Author: Author
 * @Date: 2020-07-21 16:35:03
 * @LastEditors: konglingzhan
 * @LastEditTime: 2020-08-14 17:17:24
 */
import axios from '@/utils/request.js'

/* 把对象转化为formData表单格式 */
const formUtil = (obj) => {
  const formData = new FormData()
  if (!obj || Object.keys(obj).length === 0) { return formData }
  for (const key in obj) {
    formData.append(key, obj[key])
  }
  return formData
}

// 部门树
export const deptTree = params => axios.post('/app/dept/tree', params)

// 添加部门
export const deptAdd = params => axios.post('/app/dept/add', params)

// 删除部门
export const deptDel = params => axios({
  method: 'post',
  url: '/app/dept/delById',
  params
})

// 更新部门
export const deptUpdate = (params) => axios({
  url: '/app/dept/update',
  method: 'post',
  data: params
})

// 注册用户
export const register = (params) => axios({
  url: '/app/register',
  method: 'post',
  data: formUtil(params)
})

// 用户列表
export const userList = (params) => axios({
  url: '/app/user/list',
  method: 'post',
  data: formUtil(params)
})

// 用户删除
export const delUserById = (params) => axios({
  url: '/app/user/delById',
  method: 'post',
  data: formUtil(params)
})

// 登录
export const login = params => axios({
  url: '/app/user/login',
  method: 'post',
  data: formUtil(params)
})

// 登出
export const logout = () => axios({
  url: '/app/user/logout',
  method: 'get'
})

// 权限模块树
export const aclmoduleTree = () => axios({
  url: '/app/aclmodule/tree',
  method: 'post'
})

// 权限模块add
export const aclmoduleAdd = params => axios({
  url: '/app/aclmodule/add',
  method: 'post',
  data: formUtil(params)
})

// 权限模块update
export const aclmoduleUpdate = params => axios({
  url: '/app/aclmodule/update',
  method: 'post',
  data: formUtil(params)
})

// 权限模块delete
export const aclmoduleDel = params => axios({
  url: '/app/aclmodule/del',
  method: 'post',
  data: formUtil(params)
})

// 权限点add
export const aclAdd = (params) => axios({
  url: '/app/acl/add',
  method: 'post',
  data: formUtil(params)
})
// 权限点update
export const aclUpdate = (params) => axios({
  url: '/app/acl/update',
  method: 'post',
  data: formUtil(params)
})
// 权限点delete
export const aclDel = (params) => axios({
  url: '/app/acl/del',
  method: 'post',
  data: formUtil(params)
})
// 权限点分页
export const aclPageList = (params) => axios({
  url: '/app/acl/pagelist',
  method: 'post',
  data: formUtil(params)
})

// 获取用户信息
export const getUserInfo = () => axios({
  url: '/app/user/getUserInfo',
  method: 'post'
})
