/* eslint-disable no-underscore-dangle */
import React from 'react'
import { matchRoutes } from 'react-router-config'
import { StaticRouter } from 'react-router-dom'
import { Capture } from 'react-loadable'
import { renderToString } from 'react-dom/server'
import dva from 'dva'
import { createMemoryHistory } from 'history'
import createLoading from 'dva-loading'
import models from '../../models'
import Routes, { routesList } from '../../routes'
import getRquest from '../utils/request'

export default async (ctx, next) => {
  const context = {}
  const modules = []
  const request = getRquest(ctx.headers)
  const app = dva({
    history: createMemoryHistory(),
    onError() {
    },
  })
  app.use(createLoading())
  models.map(model => model(request)).forEach(app.model)
  app.router(() => <StaticRouter location={ctx.url} context={context}><Routes /></StaticRouter>)
  const App = app.start()

  const matchedRoutes = matchRoutes(routesList, ctx.url)
    .map(({ route, match }) => ({ route, match }))
  const componentList = matchedRoutes.map(({ route: { component }, match }) => {
    if (!component.preload) {
      // eslint-disable-next-line no-param-reassign
      component.match = match
      return component
    }
    return component.preload().then((res) => {
      if (res.default) {
        res.default.match = match
        return res.default
      }
      return Object.keys(res).map(item => res[item].default)
    })
  })

  const loadedComponents = await Promise.all(componentList)
  const list = loadedComponents.map((item) => {
    if (item.getInitData) {
      return item.getInitData({ dispatch: app._store.dispatch, url: ctx.url, match: item.match })
    }
    return null
  }).filter(Boolean)

  const newList = list.reduce((acc, cur) => [
    ...acc,
    ...(Array.isArray(cur) ? cur : [cur]),
  ], [])
  await Promise.all(newList.filter(Boolean))

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
