import { getSession } from '@/utils/sessionUtil.js'

const getters = {
  loginStatus: state => {
    if (getSession('LOGIN_STATUS')) state.user.loginStatus = getSession('LOGIN_STATUS')
    return state.user.loginStatus
  },
  userInfo: state => {
    if (getSession('USER_INFO', true)) state.user.userInfo = getSession('USER_INFO')
    return state.user.userInfo
  },
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs
}
export default getters
