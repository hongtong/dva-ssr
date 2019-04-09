import { DEFAULT_TITLE } from '../constants'

export default function userModel() {
  return {
    namespace: 'global',
    state: {
      title: DEFAULT_TITLE,
      desc: '',
      keyword: '',
    },
    reducers: {
      setTDK(state, { payload: { title, desc = '', keyword = '' } }) {
      // 保存数据到 state
        return {
          ...state,
          title,
          desc,
          keyword,
        }
      },
    },
    effect: {
      * setTitle({ payload: title }, { put }) {
        window.title = title
        yield put({ type: 'setTDK', payload: title })
      },
    },
  }
}
