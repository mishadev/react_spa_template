import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'

import config from '@/config'

export default class ReactRenderer {
  constructor (store) {
    this._store = store
  }

  getDefaultMountElement () {
    return document.getElementById(config.react_mount_element_id)
  }

  render (component, element) {
    return ReactDom.render(
      React.createElement(Provider, { store: this._store }, component),
      element || this.getDefaultMountElement()
    )
  }
}
