import React from 'react';
import { api as router } from 'abyssa';

import { setCookie } from '../util/cookie';


export default React.createClass({

  render() {
    return (
      <nav className="nav">
        <a href={ router.link('app.sports') }>sports</a>
        <a href={ router.link('app.pendings') }>pendings</a>
        <a href={ router.link('app.party') }>add party</a>
        <a href="#" onClick={ this.onLogout }>logout</a>
      </nav> 
    );
  },

  onLogout(e) {
    e.preventDefault();
    setCookie('username', null, 0, res => router.transitionTo('app.login'));
  }

});