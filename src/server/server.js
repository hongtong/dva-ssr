/* eslint-disable indent */
import Koa from 'koa'
import serve from 'koa-static'
import helmet from 'koa-helmet'
import Router from 'koa-router'
import { getBundles } from 'react-loadable/webpack'
import * as R from 'ramda'
import middleware from './middleware'
import stats from '../../build/react-loadable.json'
import { getPreloadChunkList } from './utils/file'

// eslint-disable-next-line import/no-dynamic-require
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST)

const preloadChunks = getPreloadChunkList(stats)
const preloadChunksFragment = preloadChunks.map(item => `<link rel="prefetch" href="${item}" as="script">`)

const koaRouter = new Router()
koaRouter.get(
  '/*',
  ...middleware,
  (ctx) => {
    ctx.status = ctx.state.status
    const { modules = [], preloadedState = {}, markup = '' } = ctx.state
    const bundles = getBundles(stats, modules)
    const chunks = bundles.filter(bundle => bundle.file.endsWith('.js'))
    const styles = bundles.filter(bundle => bundle.file.endsWith('.css'))
    const vendorJs = R.path(['vendor', 'js'], assets)
    const crossorigin = process.env.NODE_ENV === 'production' ? '' : 'crossorigin'
    const vendorScript = vendorJs ? `<script src="${vendorJs}" defer ${crossorigin}></script>` : ''
    const script = `${vendorScript}<script src="${assets.client.js}" defer ${crossorigin}></script>`
    const title = R.path(['global', 'title'], preloadedState)
    const desc = R.path(['global', 'desc'], preloadedState) && `<meta name=”description” content=${R.path(['global', 'desc'], preloadedState)}>`
    const keyword = R.path(['global', 'keyword'], preloadedState) && `<meta name=”description” content=${R.path(['global', 'keyword'], preloadedState)}>`
    ctx.body = `<!doctype html>
  <html lang="zh-cn">
    <head>
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta charset="utf-8" />
      <title>${title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      ${preloadChunksFragment}
      ${desc || ''}${keyword || ''}
      ${assets.client.css ? `<link rel="stylesheet" href="${assets.client.css}">` : ''}
      ${styles.map(style => `<link href="${style.file}" rel="stylesheet"/>`).join('\n')}
      ${R.isEmpty(preloadedState) ? ''
        : `<script>window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\\u003c')}</script>`
      }
      ${script}
      ${chunks.map(
          chunk => (process.env.NODE_ENV === 'production'
            ? `<script src="/${chunk.file}"></script>`
            : `<script src="http://${process.env.HOST}:${parseInt(process.env.PORT, 10) + 1}/${chunk.file}"></script>`),
        ).join('\n')
      }
    </head>
    <body>
      <div id="root">${markup}</div>
    </body>
  </html>`
  },
)

// Intialize and configure Koa application
const server = new Koa()
server
  // `koa-helmet` provides security headers to help prevent common, well known attacks
  // @see https://helmetjs.github.io/
  .use(helmet())
  // Serve static files located under `process.env.RAZZLE_PUBLIC_DIR`
  .use(serve(process.env.RAZZLE_PUBLIC_DIR))
  .use(koaRouter.routes())
  .use(koaRouter.allowedMethods())

export default server
