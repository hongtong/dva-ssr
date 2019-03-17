import Koa from 'koa'
import serve from 'koa-static'
import helmet from 'koa-helmet'
import Router from 'koa-router'
import * as R from 'ramda'
import middleware from './middleware'

// eslint-disable-next-line import/no-dynamic-require
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST)

const koaRouter = new Router()
koaRouter.get(
  '/*',
  ...middleware,
  (ctx, next) => {
    if (ctx.state.context.url) {
      ctx.status = ctx.state.context.status
      ctx.redirect(ctx.state.context.url)
    } else if (ctx.state.context.status) {
      ctx.state.status = 404
      next()
    } else {
      ctx.state.status = 200
      next()
    }
  },
  (ctx) => {
    const vendorJs = R.path(['vendor', 'js'], assets)
    const crossorigin = process.env.NODE_ENV === 'production' ? '' : 'crossorigin'
    const vendorScript = vendorJs ? `<script src="${vendorJs}" defer ${crossorigin}></script>` : ''
    const script = `${vendorScript}<script src="${assets.client.js}" defer ${crossorigin}></script>`

    ctx.status = ctx.state.status
    ctx.body = `<!doctype html>
  <html lang="zh-cn">
    <head>
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta charset="utf-8" />
      <title>Welcome to Razzle + Koa</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      ${assets.client.css ? `<link rel="stylesheet" href="${assets.client.css}">` : ''}
      <script>window.__PRELOADED_STATE__ = ${JSON.stringify(ctx.state.preloadedState).replace(/</g, '\\\u003c')}</script>
      ${script}
    </head>
    <body>
      <div id="root">${ctx.state.markup}</div>
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
