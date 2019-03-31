/* eslint-disable no-underscore-dangle */
import dva from 'dva'
import { createBrowserHistory, createMemoryHistory } from 'history'
import createLoading from 'dva-loading'
import './App.css'

const createHistory = process.env.BUILD_TARGET === 'client' ? createBrowserHistory : createMemoryHistory

const preloadedState = process.env.BUILD_TARGET === 'client' ? (window.__PRELOADED_STATE__ || {}) : {}
if (process.env.BUILD_TARGET === 'client') delete window.__PRELOADED_STATE__

const app = dva({
  history: createHistory(),
  initialState: preloadedState,
  onError() {
  },
})

// 2. Plugins
app.use(createLoading())

// 3. Model move to router
// models.forEach(app.model)

export default app
