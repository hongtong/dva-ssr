/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import logo from '../react.svg'
import './Home.css'

@connect(state => state.user, {
  fetchUserRepos: username => ({ type: 'user/fetchUserRepos', payload: username }),
})
class Home extends React.Component {
  static getInitData({ dispatch, match }) {
    const { params: { username } } = match
    return dispatch({ type: 'user/fetchUserRepos', payload: username })
  }

  render() {
    const { repos } = this.props
    return (
      <div className="Home">
        <Link to="/e/hongtong">afd</Link>
        <ul>
          {
            repos.map(({ id }) => <li key={id}>{id}</li>)
          }
        </ul>
        <div className="Home-header">
          <img src={logo} className="Home-logo" alt="logo" />
          <h2>Welcome to Razzle</h2>
        </div>
        <p className="Home-intro">
          To get started, edit
          <code>src/App.js</code>
          or
          <code>src/Hfome.js</code>
          and save to reload.
        </p>
      </div>
    )
  }
}

export default Home
