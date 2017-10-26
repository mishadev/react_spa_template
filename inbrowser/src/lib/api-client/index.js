import factory from 'debug'
import qwest from 'qwest'

const debug = factory('inbrowser:api-client')

export default class APIClient {
  static init (config) {
    return Promise.resolve(new APIClient(config))
  }

  constructor (config) {
    this._headers = config.headers || {}
    this._apiurl = config.apiurl || '/api'

    this._httpClient = qwest
  }

  loadItem () {
    return Promise.resolve()
  }

  removeItem () {
    return Promise.resolve()
  }

  _request ({ path, method, params, headers }) {
    if (typeof path !== 'string') return Promise.reject('Invalid path!')
    if (!(method in this._httpClient)) return Promise.reject('Invalid method!')

    debug(`requesting url: ${this._apiurl + path}, method: ${method}`)
    return this._httpClient[method](
      this._apiurl + path,
      params,
      {
        dataType: 'json',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...this._headers,
          ...headers
        }
      }
    )
    .then((xhr, response) => {
      if (xhr.status === 200) {
        return Promise.resolve(response)
      } else {
        return Promise.reject(xhr.statusText)
      }
    })
    .catch(err => {
      return Promise.reject(err)
    })
  }
}

