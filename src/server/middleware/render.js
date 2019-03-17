/* eslint-disable no-underscore-dangle */
import React from 'react'
import { matchRoutes } from 'react-router-config'
import { StaticRouter } from 'react-router-dom'
import { renderToString } from 'react-dom/server'
import app from '../../App'
import Routes, { routesList } from '../../routes'

export default (ctx, next) => {
  const context = {}
  const matchedRoutes = matchRoutes(routesList, ctx.url).map(({ route }) => route)
  matchedRoutes.forEach(({ component }) => {
    if (component.getInitData) {
      component.getInitData({ dispatch: app._store.dispatch })
    }
  })
  app.router(() => <StaticRouter location={ctx.url} context={context}><Routes /></StaticRouter>)
  const App = app.start()
  const markup = renderToString(<App />)
  const preloadedState = app._store.getState()
  ctx.state.markup = markup
  ctx.state.context = context
  ctx.state.preloadedState = preloadedState
  next()
}
