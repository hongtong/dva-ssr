import fetch from 'dva/fetch'

export default async function request(url) {
  const result = await fetch(url)
  const reader = result.body.getReader()
  const { value } = await reader.read()
  return value
}
