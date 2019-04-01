/* eslint-disable react/prop-types */
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Loadable from 'react-loadable'
import Home from './pages/Home'
// import H2 from './pages/H2'

function Status(props) {
  return (
    <Route
      render={({ staticContext }) => {
        // we have to check if staticContext exists
        // because it will be undefined if rendered through a BrowserRouter
        if (staticContext) {
          // eslint-disable-next-line no-param-reassign
          staticContext.status = props.code
        }

        // eslint-disable-next-line react/prop-types
        return <div>{props.children}</div>
      }}
    />
  )
}


function NotFound() {
  return (
    <Status code={404}>
      <div>
        <h1>Sorry, can’t find that.</h1>
      </div>
    </Status>
  )
}

export const routesList = [
  {
    path: '/home/:username',
    component: Home,
    exact: true,
  },
  {
    path: '/e/:username',
    component: Loadable({
      loader: () => import('./pages/H2'),
      loading: () => null,
    }),
    exact: true,
  },
  {
    component: NotFound,
  },
]


const Routes = () => (
  <Switch>
    {routesList.map(route => (
      <Route {...route} key={route.path || '404'} />
    ))}
  </Switch>
)

export default Routes
