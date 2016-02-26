import update, { replace } from 'immupdate';
import { Store, Action } from 'fluxx';
// Store.log = true;


// Action
export const increment = Action('increment');
export const incrementBy = Action('incrementBy');


const initialState = { count: 0 };

export default Store({
  state: initialState,
  handlers: {

    [incrementBy]: (state, value) => {
      return update(state, { count: c => c + value });
    }

  }
});