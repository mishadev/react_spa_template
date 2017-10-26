import { CHANGE_ROUTE } from '@/state/actions'

export default {
  schema: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      path: { type: 'string' },
      pathname: { type: 'string' },
      params: { type: 'object' },
      query: { type: 'object' },
      querystring: { type: 'string' },
      state: { type: 'object' },
      hash: { type: 'object' },
      canonicalPath: { type: 'string' },
      prevPath: { type: ['string', 'boolean'] }
    },
    additionalProperties: false,
    required: [
      'name',
      'path',
      'pathname',
      'params',
      'query',
      'querystring',
      'state',
      'hash',
      'canonicalPath',
      'prevPath'
    ]
  },
  [CHANGE_ROUTE]: (state, route) => route
}
