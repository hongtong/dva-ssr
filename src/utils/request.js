import fetch from 'dva/fetch'
import queryString from 'query-string'
import urlParse from 'url'
import * as R from 'ramda'
import ApiError from '../Class/ApiError'

const isSuccess = ({ status }) => status >= 200 && status < 300

const getMessage = data => R.path(['msg'], data) || R.path(['message'], data) || R.path(['error'], data)

const parseError = (response, data, url) => {
  if (process.env.BUILD_TARGET === 'server') {
    throw new ApiError({
      message: 'request fail',
      code: response.status,
      api: url,
      response,
    })
  }

  const { status } = response
  const message = getMessage(data) || 'API 错误'

  if (status === 401) {
    window.location = 'SIGN_OUT_URL'
  }

  throw new ApiError({
    message, code: response.status, api: url, data,
  })
}


const isJson = (response) => {
  if (response.status === 204) {
    return false
  }

  if (response.headers.get('content-length') === '0') {
    return false
  }

  const type = response.headers.get('content-type')
  return type && type.indexOf('application/json') !== -1
}


const parseUrl = (url, options) => {
  if (typeof options.query === 'object') {
    const urlObj = urlParse.parse(url, true)
    const query = queryString.stringify({
      ...urlObj.query,
      ...options.query,
    })
    return `${urlObj.pathname}?${query}`
  }
  return url
}

const fillOptions = ({ body, ...options }) => {
  const newOptions = {
    ...options,
    mode: 'cors',
    // credentials: 'include',
    headers: {
      accept: 'application/json, text/plain, */*',
      ...options.headers,
    },
  }
  if (process.env.BUILD_TARGET === 'client') {
    if (body && !(body instanceof FormData)) {
      return {
        ...newOptions,
        body: JSON.stringify(body),
        headers: {
          ...newOptions.headers,
          'Content-Type': 'application/json',
        },
      }
    }
    if (body instanceof FormData) {
      return {
        ...newOptions,
        headers: {
          ...newOptions.headers,
        },
        body,
      }
    }
  }
  return newOptions
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request(url, options = {}) {
  // 添加默认options
  const newOptions = fillOptions(options)
  // 处理query参数
  const newUrl = parseUrl(url, options)

  const response = await fetch(newUrl, newOptions)

  const data = isJson(response) ? await response.json() : await response.text()

  const ret = {
    status: response.status,
    data: isSuccess(response) ? data : parseError(response, data, url),
    headers: response.headers,
  }

  return ret
}
