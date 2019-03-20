import React from 'react'
import { connect } from 'dva'
import Loadable from 'react-loadable'
import logo from '../react.svg'
import './Home.css'

const Intro = Loadable({
  loader: () => import('../components/AsyncCompents'),
  loading: () => null,
})

@connect() // import AsyncCompents from '../components/AsyncCompents'
class Home extends React.Component {
  componentDidMount() {
  }

  render() {
    return (
      <div className="Home">
        <Intro />
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
