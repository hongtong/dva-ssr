/* eslint-disable no-underscore-dangle */
import React from 'react'
import { matchRoutes } from 'react-router-config'
import { StaticRouter } from 'react-router-dom'
import { Capture } from 'react-loadable'
import { renderToString } from 'react-dom/server'
import app from '../../App'
import Routes, { routesList } from '../../routes'

export default (ctx, next) => {
  const context = {}
  const modules = []
  app.router(() => <StaticRouter location={ctx.url} context={context}><Routes /></StaticRouter>)
  const App = app.start()
  const matchedRoutes = matchRoutes(routesList, ctx.url).map(({ route }) => route)
  matchedRoutes.forEach(({ component }) => {
    if (component.getInitData) {
      component.getInitData({ dispatch: app._store.dispatch })
    }
  })
  const markup = renderToString(
    <Capture report={moduleName => modules.push(moduleName)}><App /></Capture>,
  )
  const preloadedState = app._store.getState()
  ctx.state = {
    markup,
    context,
    preloadedState,
    modules,
  }
  next()
}
