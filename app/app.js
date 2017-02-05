//-----------  Imports  -----------//

import 'babel-polyfill'

import 'sanitize.css/sanitize.css'
import './styles/global'

import '!file-loader?name=[name].[ext]!./static/favicon.ico'
import '!file-loader?name=[name].[ext]!./static/manifest.json'
import 'file-loader?name=[name].[ext]!./static/.htaccess'

import React                     from 'react'
import ReactDOM                  from 'react-dom'
import { Provider }              from 'react-redux'
import { Router,
         browserHistory,
         applyRouterMiddleware } from 'react-router'
import { syncHistoryWithStore }  from 'react-router-redux'
import { useScroll }             from 'react-router-scroll'
import FontFaceObserver          from 'fontfaceobserver'

import configureStore            from './store'
import createRoutes              from './routes'

import AppWrapper                from 'containers/AppWrapper'

//-----------  Fonts  -----------//

const openSansObserver = new FontFaceObserver('Open Sans', {})

openSansObserver.load().then(() => {
  document.body.classList.add('fontLoaded')
}, () => {
  document.body.classList.remove('fontLoaded')
})

//-----------  Redux Setups  -----------//

// this uses the singleton browserHistory provided by react-router
// Optionally, this could be changed to leverage a created history
// e.g. `const browserHistory = useRouterHistory(createBrowserHistory)()`

const initialState = {}
const store = configureStore(initialState, browserHistory)

// Sync history and store, as the react-router-redux reducer
// is under the non-default key ("routing"), selectLocationState
// must be provided for resolving how to retrieve the "route" in the state


const makeSelectLocationState = () => {
  let prevRoutingState, prevRoutingStateJS

  return (state) => {
    const routingState = state.get('route')

    if (!routingState.equals(prevRoutingState)){
      prevRoutingState = routingState
      prevRoutingStateJS = routingState.toJS()
    }

    return prevRoutingStateJS
  }
}

const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: makeSelectLocationState(),
})

//-----------  Router Setups  -----------//

const rootRoute = {
  component   : AppWrapper,
  childRoutes : createRoutes(store),
}

ReactDOM.render(
  <Provider store={store}>
    <Router
      history={history}
      routes={rootRoute}
      render={applyRouterMiddleware(useScroll())}
    />
  </Provider>,
  document.getElementById('app')
)

//-----------  Offline Setup  -----------//

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed

if (process.env.NODE_ENV === 'production'){
  require('offline-plugin/runtime').install()
}
