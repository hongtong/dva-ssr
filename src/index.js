/* eslint-disable global-require */
/* eslint-disable no-console */
import http from 'http'
import Loadable from 'react-loadable'

const app = require('./server').default

// Use `app#callback()` method here instead of directly
// passing `app` as an argument to `createServer` (or use `app#listen()` instead)
// @see https://github.com/koajs/koa/blob/master/docs/api/index.md#appcallback
Loadable.preloadAll().then(async () => {
  const currentHandler = app.callback()
  const server = http.createServer(currentHandler)
  server.listen(process.env.PORT || 3000, (error) => {
    if (error) {
      console.log(error)
    }
    console.log('🚀 started', process.env.PORT)
  })
})

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!')

  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`...')

    try {
      const newHandler = require('./server').default.callback()
      server.removeListener('request', currentHandler)
      server.on('request', newHandler)
      currentHandler = newHandler
    } catch (error) {
      console.error(error)
    }
  })
}
