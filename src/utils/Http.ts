import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import cookies from 'js-cookie'

const domain = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/'

class Http {
  get<T = any>(path: string, query?) {
    const options: any = {}
    const requestUrl = domain + path
    if (isEmpty(query) === false) {
      options.params = query
    }
    const token: string = cookies.get('token')
    if (isEmpty(token) === false) {
      options.headers = {
        Authorization: `Bearer ${token}`
      }
    }
    return axios.get<T>(requestUrl, options)
  }

  post<T = any, P = any>(path: string, data: P, headers = {}) {
    const requestUrl = domain + path
    const token: string = cookies.get('token')
    let options = {}
    if (isEmpty(token) === false) {
      options = {
        headers: {
          Authorization: `Bearer ${token}`,
          ...headers
        }
      }
    }
    return axios.post<T>(requestUrl, data, options)
  }

  put<T = any>(path: string, data, query?, headers = {}) {
    let requestUrl = domain + path
    if (isEmpty(query) === false) {
      requestUrl += this.queryStringBuilder(query)
    }
    const token: string = cookies.get('token')
    let options = {}
    if (isEmpty(token) === false) {
      options = {
        headers: {
          Authorization: `Bearer ${token}`,
          ...headers
        }
      }
    }
    return axios.put<T>(requestUrl, data, options)
  }

  delete<T = any>(path: string, data, query?) {
    let requestUrl = domain + path
    if (isEmpty(query) === false) {
      requestUrl += this.queryStringBuilder(query)
    }
    const token: string = cookies.get('token')
    let options = {}
    if (isEmpty(token) === false) {
      options = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    }
    options = { ...options, data }
    return axios.delete<T>(requestUrl, options)
  }

  queryStringBuilder(query): string {
    const str = []
    for (const p in query) {
      const value = p + '=' + query[p]
      str.push(value)
    }
    return '?' + str.join('&')
  }
}

export default new Http()
