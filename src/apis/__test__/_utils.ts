import frisby from 'frisby'
import queryString from 'query-string'

export const urlTest = 'https://malis-dev.edge-works.net/api'

export const endpoint = {
  login: '/login',
  logout: '/logout',
  init_data: '/init_data',
  manufacturer: '/manufacturers',
  location: '/locations'
}

export const acountTest = {
  user_id: 'huy15',
  password: 'aA@123456'
}

export const authenticate = () =>
  frisby.post(`${urlTest}/${endpoint.login}`, acountTest).then(({ _body }) => {
    const { access_token } = JSON.parse(_body)
    frisby.globalSetup({
      request: {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    })
    frisby.baseUrl(urlTest)
  })

export const logout = () => frisby.get(`${endpoint.logout}`)

export const postFrisbyAsync = (url: string, data) =>
  new Promise<any>((resolve, reject) => {
    frisby
      .post(url, data)
      .then(({ _body, _response }) => {
        const response = JSON.parse(_body)
        const status = _response.status
        resolve({ response, status })
      })
      .catch((error) => reject(error))
  })

export const putFrisbyAsync = (url: string, data) =>
  new Promise<any>((resolve, reject) => {
    frisby
      .put(url, data)
      .then(({ _body, _response }) => {
        const response = JSON.parse(_body)
        const status = _response.status
        resolve({ response, status })
      })
      .catch((error) => reject(error))
  })

export const deleteFrisbyAsync = (url: string, data) =>
  new Promise<any>((resolve, reject) => {
    frisby
      .del(url, data)
      .then(({ _body, _response }) => {
        const response = JSON.parse(_body)
        const status = _response.status
        resolve({ response, status })
      })
      .catch((error) => reject(error))
  })

export const getFrisbyAsync = (url: string, query?: Record<string, any>) => {
  const buildURIL = queryString.stringifyUrl({
    url,
    query
  })
  return new Promise<any>((resolve, reject) => {
    frisby
      .get(buildURIL)
      .then(({ _body, _response }) => {
        const response = JSON.parse(_body)
        const status = _response.status
        resolve({ response, status })
      })
      .catch((error) => reject(error))
  })
}
