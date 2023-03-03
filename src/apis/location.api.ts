import HttpService from '@/helper/HttpService'

class LocationApi extends HttpService {
  getNextCode = (current_code: string) => {
    return this.get(`${this._entity}/generate_code`, {
      current_code
    })
  }
}

const locationApi = new LocationApi('locations')

export default locationApi
