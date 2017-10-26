import PropTypes from 'prop-types'
import React from 'react'

import { connect } from '@/state'
import { isApplicationReady } from '@/state/application/getters'

import SplashScreen from '@components/SplashScreen'

import '@styles/index.scss'

class Master extends React.PureComponent {
  static propTypes = {
    children: PropTypes.element.isRequired,

    isReady: PropTypes.bool
  }

  render () {
    return (
      <div className="master-page">
        { !this.props.isReady && <SplashScreen /> }
        <section>
          { this.props.children }
        </section>
      </div>
    )
  }
}

export default connect(
  (state) => {
    return {
      isReady: isApplicationReady(state)
    }
  }
)(Master)
