import React from 'react'
import { connect } from 'dva'
import logo from '../react.svg'
import './Home.css'

@connect()
class Home extends React.Component {
  componentDidMount() {
  }

  render() {
    return (
      <div className="Home">
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
