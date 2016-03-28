import React from 'react';

const { func, number, oneOf } = React.PropTypes;

export default React.createClass({
  propTypes: {
    onSignIn: func,
    width: number,
    height: number,
    theme: oneOf([ 'light', 'dark' ])
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
    gapi.signin2.render('signin', {
      'scope': 'profile https://www.googleapis.com/auth/contacts.readonly',
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
    const displayText = "Sign in with Google !";
    return (
      <div id="signin"></div>
    );
  }

});