import React from "react";
import {api as router} from "abyssa";
import GoogleSignIn from "../util/GoogleSignIn";
import {get, post} from "../util/ajax";


export default React.createClass({

  onSignIn(googleUser) {
    const profile = googleUser.getBasicProfile();
    post('/api/login', {
      mail: profile.getEmail(),
      token: googleUser.getAuthResponse().id_token,
      name: profile.getName()
    }).then(
      succ => router.transitionTo('app.sports'),
      err => console.log(err)
    );
  },

  render() {
    // get('/caca').then(
    //   succ => console.log("success"),
    //   err => console.log('error', err)
    // );
    return (
      <div className="login card">
        <form>
          <GoogleSignIn onSignIn={ this.onSignIn } theme="dark"/>
        </form>
      </div>
    );
  }

});
