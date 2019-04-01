/* eslint-disable no-underscore-dangle */
import React from 'react'
import { Router } from 'react-router-dom'
import { hydrate } from 'react-dom'
import Loadable from 'react-loadable'
import dva from 'dva'
import { createBrowserHistory } from 'history'
import createLoading from 'dva-loading'

import models from './models'
import Routes from './routes'
import request from './utils/request'

import './App.css'

const app = dva({
  history: createBrowserHistory(),
  initialState: window.__PRELOADED_STATE__ || {},
  onError() {
  },
})

// 2. Plugins
app.use(createLoading())

models.forEach(model => app.model(model(request)))
app.router(({ history }) => <Router history={history}><Routes /></Router>)

const App = app.start()

Loadable.preloadReady().then(() => {
  hydrate(<App />, document.getElementById('root'))
})

delete window.__PRELOADED_STATE__
