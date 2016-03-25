import React from "react";
import {Router} from "abyssa";
import ReactState from "abyssa/lib/ReactState";
import {checkCookie} from "./util/cookie";
import layout from "./layout";
import Login from "./login";
import Sports from "./sports";
import Pendings from "./pendings";
import Score from "./score";
import { get } from "./util/ajax";


const State = ReactState(document.getElementById('reactApp'));

if (!location.hash || location.hash === '#/') {
  // checkCookie('username')
  //   .then(res => location.hash = '#/sports')
  //   .catch(err => location.hash = '#/login')
}

Router({
  app: State('', layout, {
    login: State('login', Login),
    sports: State('sports', Sports),
    pendings: State('pendings', Pendings),
    score: State('score/:type', Score)
  })
})
.configure({ urlSync: 'hash' , enableLogs: true})
.init();
