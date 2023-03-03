import HttpService from '@/helper/HttpService'

class EquivalenceApi extends HttpService {
  getList = (path, params = {}) => {
    return this.get(`${this._entity}/${path}`, params)
  }
  getNextCode = (path: string, current_code) => {
    return this.get(`${this._entity}/generate_code/${path}`, { current_code })
  }
  getEquivalenceStandards = (id: number) => {
    return this.get(`${this._entity}/${id}/standards`)
  }
}

const equivalenceApi = new EquivalenceApi('equivalences')

export default equivalenceApi
