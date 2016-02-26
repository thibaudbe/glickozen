import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'abyssa';
import { api as router } from 'abyssa';
import ReactState from 'abyssa/lib/ReactState';

import { checkCookie } from './util/cookie';

import layout from './layout';
import Login from './login';
import Sports from './sports';
import Pendings from './pendings';
import Party from './party';

const State = ReactState(document.getElementById('reactApp'));


if (!location.hash || location.hash === '#/') {
  checkCookie('username')
    .then(res => location.hash = '#/sports')
    .catch(err => location.hash = '#/login')
}

Router({
  app: State('', layout, {
    login: State('login', Login),
    sports: State('sports', Sports),
    pendings: State('pendings', Pendings),
    party: State('party', Party)
  })
})
.configure({ urlSync: 'hash' })
.init();