import axios, { AxiosInstance } from 'axios'
import _ from 'lodash'
import { parseCookies } from 'nookies'
import { singular } from 'pluralize'

class HttpService {
  private _instance: AxiosInstance
  protected _entity: string

  constructor(entity: string) {
    this._instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/'
    })
    this._instance.interceptors.response.use(this.handleSuccessRes, this.handleErrorRes)
    this._entity = entity
  }

  private handleSuccessRes(res) {
    return res.data
  }

  private handleErrorRes(error) {
    if (error.response) {
      const { data, status } = error.response
      return Promise.reject({ message: data.message, status })
    }
    return Promise.reject({ message: error.message })
  }

  private saveToken = () => {
    const cookies = parseCookies()
    if (_.size(cookies.token) !== 0) {
      this._instance.defaults.headers.common['Authorization'] = `Bearer ${cookies.token}`
    }
  }

  get = (endpoint: string, params?: any) => {
    this.saveToken()
    return this._instance.get(endpoint, { params }) as any
  }

  post = (endpoint: string, data) => {
    this.saveToken()
    return this._instance.post(endpoint, data) as any
  }

  put = (endpoint: string, data) => {
    this.saveToken()
    return this._instance.put(endpoint, data) as any
  }

  delete = (endpoint: string, data) => {
    this.saveToken()
    return this._instance.delete(endpoint, { data }) as any
  }

  getInitDataForList = (params = {}) => {
    const singularEntity = singular(this._entity)
    return this.get('init_data', {
      comp_name: `list_${singularEntity}`,
      ...params
    }) as any
  }

  getInitDataForCE = (params = {}) => {
    const singularEntity = singular(this._entity)
    return this.get('init_data', {
      comp_name: `create_edit_${singularEntity}`,
      ...params
    }) as any
  }

  getList = (params = {}) => {
    return this.get(this._entity, params) as any
  }

  getDetail = (id: number) => {
    return this.get(`${this._entity}/${id}`) as any
  }

  create = (data) => {
    return this.post(this._entity, data) as any
  }

  update = (id: number, data) => {
    return this.put(`${this._entity}/${id}`, data) as any
  }

  updateMultiple = (data) => {
    return this.put(this._entity, { [this._entity]: data }) as any
  }

  executeOperation = (operation, data) => {
    if (operation === 'delete') {
      return this.delete(this._entity, { [this._entity]: data }) as any
    }
    return this.put(`${this._entity}/${operation}`, { [this._entity]: data }) as any
  }

  getGeneratedCode = (query: Record<string, any>) => this.get(`${this._entity}/generate_code`, query)
}

export default HttpService
