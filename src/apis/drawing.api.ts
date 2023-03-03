import HttpService from '@/helper/HttpService'
class DrawingApi extends HttpService {
  saveRevision = (drawingId: number, data) => {
    return this.put(`${this._entity}/${drawingId}/revise`, data)
  }
  getInitDataForRevise = (current_revision: string) => {
    return this.get('init_data', {
      comp_name: 'revise_drawing',
      current_revision
    })
  }
  getItemList = (drawingId: number) => {
    return this.get(`${this._entity}/${drawingId}/items`)
  }
}

const drawingApi = new DrawingApi('drawings')

export default drawingApi
