import HttpService from '@/helper/HttpService'

class GroupApi extends HttpService {
  getPermissionsList = () => {
    return this.get('permissions')
  }

  updatePermissionsList = (permissions) => {
    return this.post('permissions', permissions)
  }
}

const groupApi = new GroupApi('groups')

export default groupApi
