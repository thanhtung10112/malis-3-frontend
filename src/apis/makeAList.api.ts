import HttpService from '@/helper/HttpService'

class MakeAListApi extends HttpService {
  share = (id, is_shared) => {
    return this.put(`${this._entity}/${id}`, { is_shared })
  }
  remove = (id) => {
    return this.delete(`${this._entity}/${id}`, { id })
  }
  clearDefault = (entity) => {
    return this.post(`${this._entity}/clear_default`, { entity })
  }
  startMakeAListExport = (exportRequest) => {
    return this.post('make_a_list/start', exportRequest)
  }
  stopMakeAListExport = (stopRequestData) => {
    return this.post('make_a_list/stop', stopRequestData)
  }
  checkPermissions = (entity) => {
    return this.get('permissions/make_a_list', { entity })
  }
  getInitDataForList = (entity) => {
    return this.get('init_data', {
      comp_name: 'make_a_list_preset_list',
      entity
    })
  }
  getInitDataForCE = (entity) => {
    return this.get('init_data', {
      comp_name: 'make_a_list_create_edit',
      entity
    })
  }
}

const makeAListApi = new MakeAListApi('make_a_list_presets')

export default makeAListApi
