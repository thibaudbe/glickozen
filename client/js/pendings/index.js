import React from 'react';
import { api as router } from 'abyssa';

import { checkCookie } from '../util/cookie';


export default React.createClass({

  componentWillMount() {
    checkCookie('username')
      .catch(res => router.transitionTo('app.login'))
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