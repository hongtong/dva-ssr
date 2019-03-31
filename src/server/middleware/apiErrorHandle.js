import app from '../../App'

export default async (ctx, next) => {
  try {
    await next()
  } catch (e) {
    // eslint-disable-next-line no-underscore-dangle
    app._models = []
    if (e.code === 404) {
      ctx.status = 404
      ctx.body = '123'
    } else if (e.code === 401) {
      ctx.redirect('/login')
    } else {
      ctx.status = 500
    }
  }
}
