/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import React from 'react'
import { connect } from 'dva'
// import ItemList from './ItemList'

function listSelector(state, ownProps) {
  const page = parseInt(ownProps.match.params.page || 1, 10)
  const {
    itemsPerPage, activeType, lists, itemsById,
  } = state.item
  const ids = lists[activeType].slice(itemsPerPage * (page - 1), itemsPerPage * page)
  const items = ids.reduce((memo, id) => {
    if (itemsById[id]) memo.push(itemsById[id])
    return memo
  }, [])
  const maxPage = Math.ceil(lists[activeType].length / itemsPerPage)
  return {
    items,
    page,
    maxPage,
    activeType,
  }
}

@connect()
class ListPage extends React.Component {
  static getInitData({ dispatch }) {
    dispatch({ type: 'item/fetchList', payload: { type: 'top', page: 1 } })
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({ type: 'item/fetchList', payload: { type: 'top', page: 1 } })
  }

  render() {
    const {
      loading, items, page, maxPage, activeType, location,
    } = this.props
    return (
      <div>
        <div
          loading={loading}
          items={items}
          page={page}
          maxPage={maxPage}
          activeType={activeType}
          location={location}
        />
      </div>
    )
  }
}

export default ListPage
