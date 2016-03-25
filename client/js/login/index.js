import React from "react";
import { api as router } from "abyssa";
import GoogleSignIn from "../util/GoogleSignIn";
import { checkCookie } from "../util/cookie";


export default React.createClass({

  componentWillMount() {
    checkCookie('username')
      .then(res => router.transitionTo('app.sports'))
  },

  onSignIn(googleUser) {
    const profile = googleUser.getBasicProfile();
    post('/login', {
      mail: profile.getEmail(),
      token: googleUser.getAuthResponse().id_token,
      name: profile.getName()
    }).then(
      succ => router.transitionTo('app.sports'),
      err => console.log('bad username, must be a trigram')
    );
  },

  render() {
    return (
      <div className="login card">
        <form>
          <GoogleSignIn onSignIn={ this.onSignIn } theme="dark"/>
        </form>
      </div> 
    );
  }

});