import initData from './initData';
import update, { replace } from 'immupdate';
import { Store, Action } from 'fluxx';
// Store.log = true;


const { sports } = initData;

const initialState = { count: 0, sports };


// Action
export const increment = Action('increment');
export const incrementBy = Action('incrementBy');


// Store
export default Store({
  state: initialState,
  handlers: {

    [incrementBy]: (state, value) => {
      return update(state, { count: c => c + value });
    }

  }
});