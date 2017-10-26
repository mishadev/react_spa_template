import ApiClient from '@/lib/api-client'
import config from '@/config'

import {
  LOAD_SOME_ITEM,
  REMOVE_SOME_ITEM
} from '@/state/actions'

export default {
  init: () => {
    return ApiClient.init({
      apiurl: config.api_url,
      debug: config.is_development
    })
    .then(
      api => {
        return {
          [LOAD_SOME_ITEM]: (id) => api.loadItem(id),
          [REMOVE_SOME_ITEM]: (id) => api.removeItem(id)
        }
      })
  }
}
