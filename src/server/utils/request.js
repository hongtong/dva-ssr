import fetch from 'dva/fetch'
import queryString from 'query-string'
import urlParse from 'url'
import ApiError from '../../Class/ApiError'

const isSuccess = ({ status }) => status >= 200 && status < 300

const parseError = (response, url) => {
  throw new ApiError({
    message: 'request fail',
    code: response.status,
    api: url,
    response,
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
      host: undefined,
    },
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
async function request(url, options = {}) {
  // 添加默认options
  const newOptions = fillOptions(options)
  // 处理query参数
  const newUrl = parseUrl(url, options)
  const response = await fetch(newUrl, newOptions)

  const data = isJson(response) ? await response.json() : await response.text()

  const ret = {
    status: response.status,
    data: isSuccess(response) ? data : parseError(response, url),
    headers: response.headers,
  }

  return ret
}

export default function getRquest(headers) {
  return (url, opt = {}) => request(url, { ...opt, headers: { ...headers, ...opt.headers } })
}
