import { get, post } from './util/ajax';

export const getContacts = () => get('/api/getContacts')
  .then(
    succ => succ.data
  );

export const setScore = (data) => post('/api/games', data);