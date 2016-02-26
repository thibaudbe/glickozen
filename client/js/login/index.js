import React from 'react';
import ReactDOM from 'react-dom';
import { api as router } from 'abyssa';

import { setCookie, checkCookie } from '../util/cookie';


export default React.createClass({

  componentWillMount() {
    checkCookie('username')
      .then(res => router.transitionTo('app.sports'))
  },

  render() {
    return (
      <div className="login">
        <form onSubmit={ this.onSubmit }>
          <div className="field">
            <label htmlFor="username">Trigramme</label>
            <input type="text" name="username" ref="username" />
          </div>
          <button type="submit">Let's go</button>
        </form> 
      </div> 
    );
  },

  onSubmit(e) {
    e.preventDefault();
    const username = ReactDOM.findDOMNode(this.refs.username).value;

    if (username.length === 3) {
      setCookie('username', username, 365, res => router.transitionTo('app.sports'));
    } else {
      console.log('bad username, must be a trigram');
    }
  }

});