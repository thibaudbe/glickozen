import React from 'react';


export default React.createClass({

  onSignIn: function(googleUser) {
    console.log("user signed in"); // plus any other logic here
    const profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());
  },

  renderGoogleLoginButton() {
    console.log('rendering google signin button');
    gapi.signin2.render('my-signin2', {
      'scope': 'https://www.googleapis.com/auth/plus.login',
      'width': 350,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': this.onSignIn
    })
  },

  componentDidMount() {
    window.addEventListener('google-loaded',this.renderGoogleLoginButton);
  },

  render() {
    let displayText = "Sign in with Google";
    return (
      <div id="my-signin2"></div>
    );
  }

});