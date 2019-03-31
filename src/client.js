import React from 'react'
import { Router } from 'react-router-dom'
import { hydrate } from 'react-dom'
import Loadable from 'react-loadable'

import app from './App'
import models from './models'
import Routes from './routes'
import request from './utils/request'

models.forEach(model => app.model(model(request)))
app.router(({ history }) => <Router history={history}><Routes /></Router>)

const App = app.start()

Loadable.preloadReady().then(() => {
  hydrate(<App />, document.getElementById('root'))
})
