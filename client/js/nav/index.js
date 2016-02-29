import React from 'react';
import { api as router } from 'abyssa';
import connect from 'fluxx/lib/ReactConnector';

import store, { incrementBy } from '../store';
import { setCookie, checkCookie, getCookie } from '../util/cookie';
import { get } from '../util/ajax';


const Nav = React.createClass({

  getInitialState() {
    return {
      pendings: []
    }
  },

  componentWillMount() {
    checkCookie('username')
      .catch(res => router.transitionTo('app.login'))

    get(`/api/games/pending?player=${getCookie('username')}`)
      .then(list => this.setState({ pendings: list }))

  },

  render() {
    const { pendings } = this.state;
    const pendingLength = pendings !== 0 ? <button className="notif" onClick={ () => router.transitionTo('app.pendings') }>{ pendings.length }</button> : undefined;

    return (
      <nav className="nav">
        <a href={ router.link('app.sports') }>sports</a>
        <a href={ router.link('app.pendings') }>pendings</a>
        <a href="#" onClick={ this.onLogout }>logout</a>
        { pendingLength }
      </nav> 
    );
  },

  onLogout(e) {
    e.preventDefault();
    setCookie('username', null, 0, res => router.transitionTo('app.login'));
  }

});


export default connect(Nav, store, (state): count => (
  { count: state.count }
));