/*
 * @Descripttion: DOP
 * @version: 1.0.0
 * @Author: Author
 * @Date: 2020-07-21 16:35:03
 * @LastEditors: konglingzhan
 * @LastEditTime: 2020-08-10 15:56:13
 */
import axios from '@/utils/request.js'

// 部门树
export const deptTree = params => axios.post('/dept/tree', params)

// 添加部门
export const deptAdd = params => axios.post('/dept/add', params)

// 删除部门
export const deptDel = params => axios({
  method: 'post',
  url: '/dept/delById',
  params
})

// 更新部门
export const deptUpdate = (params) => axios({
  url: '/dept/update',
  method: 'post',
  data: params
})

// 注册用户
export const register = (params) => axios({
  url: 'register',
  method: 'post',
  data: params
})

/* 把对象转化为formData表单格式 */
const formUtil = (obj) => {
  const formData = new FormData()
  if (Object.keys(obj).length === 0) { return formData }
  for (const key in obj) {
    formData.append(key, obj[key])
  }
  return formData
}

// 登录
export const login = params => axios({
  url: '/login',
  method: 'post',
  data: formUtil(params)
})
