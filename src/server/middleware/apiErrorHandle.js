export default async (ctx, next) => {
  try {
    await next()
  } catch (e) {
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
