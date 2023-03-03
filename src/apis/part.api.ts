import HttpService from '@/helper/HttpService'

class PartApi extends HttpService {
  constructor() {
    super('parts')
  }

  getReferencedPart = (params) => this.get('referenced_part', params)

  getDescriptions = (partId: number) => this.get(`${this._entity}/${partId}/descriptions`)
}

const partApi = new PartApi()

export default partApi
