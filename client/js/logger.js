import { Store } from 'fluxx';
import { Router } from 'abyssa';
import queryString from './util/queryString';


const log = queryString('log');

if (log.indexOf('fluxx') === 0 || log.indexOf('store') === 0 || log === 'all') 
  Store.log = true;


if (log === 'abyssa' || log === 'router' || log === 'all')
  Router.enableLogs();
