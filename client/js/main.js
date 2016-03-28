import React from 'react';
import { Router } from 'abyssa';
import ReactState from 'abyssa/lib/ReactState';
import { checkCookie } from './util/cookie';
import './logger';

import initData from './util/dom/initData';
import { init } from './store/action';

import App from './layout';
import Login from './login';
import Sports from './sports';
import Pendings from './pendings';

const State = ReactState(document.getElementById('reactApp'));


/* Load the persistent stores with the JSON data transmitted with the HTML */
init(initData);

Router({
  app: State('', App, {
    login: State('login', Login),
    sports: State('sports', Sports),
    pendings: State('pendings', Pendings)
  })
})
.configure({ urlSync: 'hash' })
.init();
