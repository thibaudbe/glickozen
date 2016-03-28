import { Store } from 'fluxx';
import update, { replace } from 'immupdate';

import { init, isLogged, showScore, showPendings, contacts } from './action';


const initialState = {
  _isLogged: true,
  _showScore: false,
  _showPendings: false,
  contacts: []
};


export default Store({
  state: initialState,
  handlers: {

    [init]: (state, initData) => {
      const { sports } = initData;
      return update(state, { sports });
    },

    [isLogged]: (state, flag) => {
      return update(state, { '_isLogged': flag });
    },

    [showScore]: (state, flag) => {
      return update(state, { '_showScore': flag });
    },

    [showPendings]: (state, flag) => {
      return update(state, { '_showPendings': flag });
    },

    [contacts]: (state, list) => {
      return update(state, { 'contacts': list });
    }

  }
});