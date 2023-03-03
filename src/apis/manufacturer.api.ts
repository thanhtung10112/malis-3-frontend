import HttpService from '@/helper/HttpService'

class ManufacturerApi extends HttpService {
  getNextCode = (current_code: number) => {
    return this.get(`${this._entity}/get_next_code`, {
      current_code
    })
  }
}

const manufacturerApi = new ManufacturerApi('manufacturers')

export default manufacturerApi
