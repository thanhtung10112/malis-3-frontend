import HttpService from '@/helper/HttpService'

class SpecificationApi extends HttpService {
  getGenerateCode = (drawing_id: number) => {
    return this.get(`${this._entity}/generate_code`, { drawing_id })
  }
}

const specificationApi = new SpecificationApi('specifications')

export default specificationApi
