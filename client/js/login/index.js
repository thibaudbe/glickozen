import React from "react";
import { api as router } from "abyssa";
import GoogleSignIn from "../util/GoogleSignIn";
import { checkCookie } from "../util/cookie";
import { post } from "../util/ajax"


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
      err => console.log(err)
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