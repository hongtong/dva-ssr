import * as R from 'ramda'

export default (ctx, next) => {
  const redirectUrl = R.path(['state', 'context', 'url'], ctx)
  const status = R.path(['state', 'context', 'status'], ctx)
  if (redirectUrl) {
    ctx.status = status
    ctx.redirect(redirectUrl)
  } else if (status) {
    ctx.state.status = status
    next()
  } else {
    ctx.state.status = 200
    next()
  }
}
