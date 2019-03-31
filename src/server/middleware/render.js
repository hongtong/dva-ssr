/* eslint-disable no-underscore-dangle */
import React from 'react'
import { matchRoutes } from 'react-router-config'
import { StaticRouter } from 'react-router-dom'
import { Capture } from 'react-loadable'
import { renderToString } from 'react-dom/server'
import app from '../../App'
import models from '../../models'
import Routes, { routesList } from '../../routes'
import getRquest from '../utils/request'

export default async (ctx, next) => {
  const context = {}
  const modules = []
  const request = getRquest(ctx.headers)
  models.map(model => model(request)).forEach(app.model)
  app.router(() => <StaticRouter location={ctx.url} context={context}><Routes /></StaticRouter>)
  const App = app.start()
  const matchedRoutes = matchRoutes(routesList, ctx.url)
    .map(({ route, match }) => ({ route, match }))
  const list = matchedRoutes.map(({ route: { component }, match }) => {
    if (component.getInitData) {
      return component.getInitData({ dispatch: app._store.dispatch, url: ctx.url, match })
    }
    return null
  }).filter(item => item)

  await Promise.all(list)

  const markup = renderToString(
    <Capture report={moduleName => modules.push(moduleName)}><App /></Capture>,
  )
  const preloadedState = app._store.getState()
  app._models = []
  ctx.state = {
    markup,
    context,
    preloadedState,
    modules,
  }
  next()
}
