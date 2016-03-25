import React from 'react';
import { post } from '../util/ajax';


export default React.createClass({
  propTypes: {
    onSignIn: React.PropTypes.func,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    theme: React.PropTypes.oneOf(['light', 'dark'])
  },
  
  getDefaultProps() {
    return {
      theme: 'dark',
      width: 350,
      onSignIn: () => {}
    }
  },

  renderGoogleLoginButton() {
    const { width, height, theme, onSignIn } = this.props;
    gapi.signin2.render('my-signin2', {
      'scope': 'https://www.googleapis.com/auth/plus.login',
      'width': width,
      'height': height,
      'longtitle': true,
      'theme': theme,
      'onsuccess': onSignIn
    })
  },

  componentDidMount() {
    window.addEventListener('google-loaded',this.renderGoogleLoginButton);
  },

  render() {
    const displayText = "Sign in with Google";
    return (
      <div id="my-signin2"></div>
    );
  }

});