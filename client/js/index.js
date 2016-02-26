import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'abyssa';
import { api as router } from 'abyssa';
import ReactState from 'abyssa/lib/ReactState';

import layout from './layout';
import Home from './home';

const State = ReactState(document.getElementById('reactApp'));


if (!location.hash || location.hash === '#/') {
  location.hash = '#/';
}

Router({
  index: State('', layout, {
    home: State('', Home)
  })
})
.configure({ urlSync: 'hash' })
.init();