import HttpService from '@/helper/HttpService'

class TagApi extends HttpService {
  getGenerateCode = (drawing_id: number) => {
    return this.get(`${this._entity}/generate_code`, { drawing_id })
  }
}

const tagApi = new TagApi('elements')

export default tagApi
