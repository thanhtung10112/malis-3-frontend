import HttpService from '@/helper/HttpService'

import type { LoginRequest } from '@/types/Auth'

class AuthApi extends HttpService {
  login = (request: LoginRequest) => {
    return this.post('login', request)
  }
  getProfile = () => {
    return this.get(this._entity)
  }
  changePassword = (request) => {
    return this.put(`${this._entity}/change_password`, request)
  }
  getSettings = () => {
    return this.get('settings')
  }

  saveSettings = (request) => {
    return this.put('settings', request)
  }

  getInitDataForSetting = () => {
    return this.get('init_data', { comp_name: 'user_setting' })
  }
}

const authApi = new AuthApi('profile')

export default authApi
