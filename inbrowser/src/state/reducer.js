import { createRootReducer, combine } from '@/state/utils'

import application from './application'
import route from './route'

const rootCombination = combine({
  application,
  route
})

export default createRootReducer(rootCombination)

