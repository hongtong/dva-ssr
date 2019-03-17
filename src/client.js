import React from 'react'
import { Router } from 'react-router-dom'
import { hydrate } from 'react-dom'

import app from './App'
import Routes from './routes'

app.router(({ history }) => <Router history={history}><Routes /></Router>)

const App = app.start()

hydrate(<App />, document.getElementById('root'))
