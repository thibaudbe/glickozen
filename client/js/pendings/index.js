import React from 'react';
import { api as router } from 'abyssa';

import { checkCookie, getCookie } from '../util/cookie';
import { get } from '../util/ajax';


export default React.createClass({

  componentWillMount() {
    checkCookie('username')
      .catch(res => router.transitionTo('app.login'))

    get(`/api/games/pending?player=${getCookie('username')}`)
      .then(res => console.log('res', res))

  },

  render() {
    return (
      <div className="pendings">
        <ul className="unstyled">
          <li>item</li>
          <li>item</li>
          <li>item</li>
          <li>item</li>
          <li>item</li>
        </ul>
      </div> 
    );
  }

});