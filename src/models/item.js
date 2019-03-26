import {
  fetchIdsByType,
  fetchItem,
  fetchItems,
} from '../services/hn'

export default {

  namespace: 'item',

  state: {
    activeType: null,
    itemsPerPage: 20,
    lists: {
      top: [],
      new: [],
      show: [],
      ask: [],
      job: [],
    },
    itemsById: {},
  },

  effects: {
    * fetchList({ payload }, { put, call, select }) {
      const { type, page } = payload
      const ids = yield call(fetchIdsByType, type)
      const itemsPerPage = yield select(state => state.item.itemsPerPage)
      const items = yield call(
        fetchItems,
        ids.slice(itemsPerPage * (page - 1), itemsPerPage * page),
      )
      yield put({ type: 'saveList', payload: { ids, type } })
      yield put({ type: 'saveItems', payload: items })
    },

    * fetchComments({ payload: id }, { put, call }) {
      const item = yield call(fetchItem, id)
      yield put({ type: 'saveItems', payload: [item] })

      let ids = item.kids
      while (ids && ids.length) {
        const items = yield call(fetchItems, ids)
        yield put({ type: 'saveItems', payload: items })
        ids = items.reduce((_memo, q) => {
          let memo = _memo
          if (q.kids) {
            memo = [...memo, ...q.kids]
          }
          return memo
        }, [])
      }
    },
  },

  reducers: {
    saveList(state, { payload }) {
      const { ids, type } = payload
      return { ...state, lists: { ...state.lists, [type]: ids } }
    },

    saveItems(state, { payload: itemsArr }) {
      const items = itemsArr.reduce((_memo, item) => {
        const memo = _memo
        memo[item.id] = item
        return memo
      }, {})
      return { ...state, itemsById: { ...state.itemsById, ...items } }
    },

    saveActiveType(state, { payload: activeType }) {
      return { ...state, activeType }
    },
  },
}
