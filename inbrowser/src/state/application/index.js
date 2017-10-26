import {
  APPLICATION_BOOTING,
  APPLICATION_INITIALIZED,
  APPLICATION_RELOAD
} from '@/state/actions'

export default {
  schema: {
    type: 'object',
    properties: {
      initialized: { type: 'boolean' },
      unloaded: { type: 'boolean' }
    },
    additionalProperties: false,
    required: ['initialized', 'unloaded'],
    default: {
      initialized: false,
      unloaded: false
    }
  },
  [APPLICATION_BOOTING]: state => {
    return {
      ...state,
      initialized: false
    }
  },
  [APPLICATION_INITIALIZED]: state => {
    return {
      ...state,
      initialized: true
    }
  },
  [APPLICATION_RELOAD]: state => {
    return {
      ...state,
      unloaded: true,
      initialized: false
    }
  }
}
