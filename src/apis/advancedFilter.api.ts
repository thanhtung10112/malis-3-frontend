import HttpService from '@/helper/HttpService'

import type { Entity } from '@/types/Common'

class AdvancedFilterApi extends HttpService {
  share = (id, is_shared) => {
    return this.put(`${this._entity}/${id}`, { is_shared })
  }

  clearDefault = (entity: Entity) => {
    return this.post(`${this._entity}/clear_default`, { entity })
  }

  getInitDataForList = (entity: Entity) => {
    return this.get('init_data', { comp_name: 'advanced_filter_list', entity })
  }

  getInitDataForCE = (entity: Entity) => {
    return this.get('init_data', {
      comp_name: 'advanced_filter_create_edit',
      entity
    })
  }

  remove = (id) => {
    return this.delete(`${this._entity}/${id}`, { id })
  }
}

const advancedFilterApi = new AdvancedFilterApi('filter_presets')

export default advancedFilterApi
