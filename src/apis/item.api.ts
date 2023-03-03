import HttpService from '@/helper/HttpService'

class ItemApi extends HttpService {
  getGenerateCode = (drawing_id: number) => {
    return this.get(`${this._entity}/generate_code`, { drawing_id })
  }
}

const itemApi = new ItemApi('items')

export default itemApi
