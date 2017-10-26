import React from 'react'

import factory from 'debug'
import page from 'page'

import qs from 'querystring'
import url from 'url'

import { pick, each, get, partial, concat, map, trim, reverse } from 'lodash'

import config from '@/config'
import routes from '@/routing/config'

import { CHANGE_ROUTE } from '@/state/actions'

const debug = factory('inbrowser:booting-routing')

function createRouteDispatchMiddleware (dispatcher) {
  return (context, next) => {
    dispatcher.Command(CHANGE_ROUTE,
      pick(context, [
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
      ])
    )
    next()
  }
}

function createRouteComponentMiddleware (routemap) {
  return (context, next) => {
    context.component = React.createElement(
      routemap.component, { }, context.component)
    next()
  }
}

function createRouteNameMiddleware (routemap) {
  return (context, next) => {
    context.name = routemap.name
    next()
  }
}

function registerRoute (middlewares, parents, routemap) {
  parents = [...parents, routemap]
  if (+get(routemap.children, 'length') > 0) {
    each(
      routemap.children,
      partial(registerRoute, middlewares, parents)
    )
  } else {
    const path = map(parents, pmap => trim(pmap.path, '/')).join('/')
    debug('register path', path)
    page(
      path,
      ...concat(
        createRouteNameMiddleware(routemap),
        map(reverse(parents), createRouteComponentMiddleware),
        middlewares
      )
    )
  }
}

function registerUrlParser () {
  page('*', (context, next) => {
    const parsed = url.parse(location.href, true)

    // Break routing and do full load for logout link
    if (context.pathname === 'logout') {
      window.location.href = context.path
      return
    }

    const querystringStart = context.canonicalPath.indexOf('?')

    if (querystringStart !== -1) {
      const querystring = context.canonicalPath.substring(
        querystringStart + 1)

      context.query = qs.parse(querystring)
    } else {
      context.query = {}
    }

    context.prevPath = parsed.path === context.path ? false : parsed.path

    // NOTE: we have to parse hash manually
    // and set `context.hash`
    if (parsed.hash && parsed.hash.length > 1) {
      try {
        context.hash = qs.parse(parsed.hash.substring(1))
      } catch (e) {
        debug('failed to query-string parse `location.hash`', e)
        context.hash = {}
      }
    } else {
      context.hash = {}
    }
    next()
  })
}

export default {
  init: ({ dispatcher, renderer }) => {
    debug('Initializing routing.')

    registerUrlParser()

    const middlewares = [
      createRouteDispatchMiddleware(dispatcher),
      (context) => renderer.render(context.component)
    ]

    each(routes, partial(registerRoute, middlewares, []))

    page.base(config.app_public_path)
    page.start()
  }
}

