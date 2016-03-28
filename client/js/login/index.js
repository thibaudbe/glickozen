import React from 'react';
import { api as router } from 'abyssa';
import { post } from '../util/ajax';
import GoogleSignIn from './GoogleSignIn';


export default React.createClass({

  render() {
    const id = 'login';

    return (
      <div id={ id } className="card">
        <GoogleSignIn onSignIn={ this.onSignIn } theme="dark" />
      </div>
    );
  },

  onSignIn(googleUser) {
    const { getBasicProfile, getAuthResponse } = googleUser;
    const { getEmail, getName } = getBasicProfile();

    const data = {
      mail: getEmail(),
      token: getAuthResponse().id_token,
      name: getName()
    };

    post('/api/login', data)
      .then(e => router.transitionTo('app.sports'))
      .catch(x => x);
  }

});
