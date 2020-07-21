/*
 * @Descripttion: DOP
 * @version: 1.0.0
 * @Author: Author
 * @Date: 2020-07-21 16:35:03
 * @LastEditors: konglingzhan
 * @LastEditTime: 2020-07-21 16:40:51
 */
import axios from '@/utils/request.js'

// 部门树
export const deptTree = params => axios.post('/dept/tree', params)

