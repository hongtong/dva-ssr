import request from '../utils/request'

const api = 'https://hacker-news.firebaseio.com/v0/'

export function fetchIdsByType(type) {
  return request(`${api}${type}stories.json?print=pretty`)
}

export function fetchItem(id) {
  const a = request(`${api}item/${id}.json?print=pretty`)
  return a
}

export function fetchItems(ids) {
  const b = Promise.all(ids.map(id => fetchItem(id)))
  debugger
  return b
}

export function fetchUser(id) {
  return request(`${api}user/${id}.json?print=pretty`)
}
