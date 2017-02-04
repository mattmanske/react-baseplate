//-----------  Imports  -----------//

import { Block }            from './styles'

import React, { PropTypes } from 'react'
import { Link }             from 'react-router'
import Helmet               from 'react-helmet'

import ProgressBar          from 'components/ProgressBar'
import GlobalHeader         from 'components/GlobalHeader'

//-----------  Component  -----------//

class AppWrapper extends React.Component {

  state = {
    progress     : -1,
    loadedRoutes : this.props.location && [this.props.location.pathname],
  }

  componentWillMount(){
    this.unsubscribeHistory = this.props.router && this.props.router.listenBefore((location) => {
      if (this.state.loadedRoutes.indexOf(location.pathname) === -1)
        this.updateProgress(0)
    })
  }

  componentWillUpdate(newProps, newState){
    const { loadedRoutes, progress } = this.state
    const { pathname } = newProps.location

    if (loadedRoutes.indexOf(pathname) === -1 && progress !== -1 && newState.progress < 100){
      this.updateProgress(100)
      this.setState({ loadedRoutes: loadedRoutes.concat([pathname]) })
    }
  }

  componentWillUnmount(){
    this.unsubscribeHistory = undefined
  }

  //-----------  Event Handlers  -----------//

  updateProgress = (progress) => {
    this.setState({ progress })
  }

  //-----------  HTML Render  -----------//

  render(){
    const { props, state } = this

    return(
      <Block>
        <Helmet
          titleTemplate="%s - React.js Boilerplate"
          defaultTitle="React.js Boilerplate"
          meta={[{ name: 'description', content: 'A React.js Boilerplate application' }]}
        />

        <ProgressBar percent={state.progress} updateProgress={this.updateProgress} />

        <GlobalHeader>
          <Link to={'/about'}>About Us</Link>
        </GlobalHeader>

        {React.Children.toArray(props.children)}
      </Block>
    )
  }
}

//-----------  Prop Types  -----------//

AppWrapper.propTypes = {
  location : PropTypes.object,
  router   : PropTypes.object,
  children : PropTypes.node.isRequired,
}

//-----------  Exports  -----------//

export default AppWrapper
