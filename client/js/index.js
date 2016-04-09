import React from 'react';
import { Router } from 'abyssa';
import ReactState from 'abyssa/lib/ReactState';
import layout from './layout';
import Sports from './sports';
import Pendings from './pendings';
import Score from './score';


const State = ReactState(document.getElementById('reactApp'));

Router({
  app: State('', layout, {
    show: {
      uri: '',
      enter: (x, y, router) => { router.transitionTo('sports'); }
    },
    sports: State('sports', Sports),
    pendings: State('pendings', Pendings),
    score: State('score/:type', Score)
  })
})
.configure({ enableLogs: false })
.init();
