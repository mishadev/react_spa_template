import config from '@/config'
if (process.env.NODE_ENV === 'development') {
  // NOTE: setting up debug parameter
  // example 'inbrowser:*' to see log of
  // all project modules
  localStorage.debug = config.debug
}

import factory from 'debug'
import { delay } from 'lodash'

const debug = factory('inbrowser:application')

import asynchronous from '@/asynchronous'
import { mount } from '@/state'

import routing from '@/routing'

import {
  APPLICATION_BOOTING,
  APPLICATION_INITIALIZED
} from '@/state/actions'

import ReactRenderer from '@/boot/react-renderer'

const boot = ({ store, dispatcher }) => {
  debug('Booting Application!')
  dispatcher.Command(APPLICATION_BOOTING)

  if (config.is_development) {
    require('@/boot/development')()
  }
  const renderer = new ReactRenderer(store)
  routing.init({ dispatcher, renderer })

  dispatcher.Command(APPLICATION_INITIALIZED)
}

const AppBoot = () => {
  asynchronous.init()
    .then(mount)
    .then(boot)
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error)
      debug('Rebooting application')
      delay(AppBoot, config.application_relaunch_timeout)
    })
}

AppBoot()
