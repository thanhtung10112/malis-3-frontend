import HttpService from '@/helper/HttpService'

class AssemblyApi extends HttpService {
  getGenerateCode = (drawing_id: number) => {
    return this.get(`${this._entity}/generate_code`, { drawing_id })
  }
}

const assemblyApi = new AssemblyApi('assemblies')

export default assemblyApi
