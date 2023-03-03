import HttpService from '@/helper/HttpService'

class ParameterApi extends HttpService {
  getList = (param_type_id: string, params = {}) => {
    return this.get(`parameter_types/${param_type_id}/${this._entity}`, params)
  }
}

const parameterApi = new ParameterApi('parameters')

export default parameterApi
