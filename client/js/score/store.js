import { Store, Action } from 'fluxx';
import update, { replace } from 'immupdate';
import {api as router} from "abyssa";
import moment from "moment";
import * as api from '../api';


// Actions
const init = Action('init');
const onChange = Action('onChange');
const submit = Action('submit');

// Private actions
const _setContacts = Action("_setContacts");
const _addError = Action("_addError");

export const actions = {
  init: init,
  onChange: onChange,
  submit: submit
};


const defaultState = () => {
  return {
    contacts: [],
    errors: [],
    data: {
      team1: [],
      team2: [],
      date: moment().format('YYYY-MM-DD')
    }
  }
};

// Store
export const store =  Store({
  state: defaultState(),
  handlers: {

    [init]: (state, sport) => {
      api.getContacts().then(
        contacts => _setContacts(contacts),
        error => _addError("global", error)
      );
      
      return update(state, { data: { sport: sport } });
    },
    
    [onChange]: (state, field, event) => {
      if (field === "team1" || field === "team2") {
        const values = event.split(",");
        return update(state, { data: { [field]: values } });
      } else return update(state, {data: {[field]: event.target.value} });
    },
    
    [submit]: (state, score) => {
      api.setScore(update(state.data, { 
        team1Score: score
      })).then(
        succ => router.transitionTo('app.sports'),
        error => _addError("global", error)
      );
      
      return state;
    },
    
    [_setContacts]: (state, contacts) => update(state, { contacts: contacts.map(user => {
      return { value: user.email, label: `${user.firstName} ${user.lastName}`}
    }) }),
      
    [_addError]: (state, key, error) => update(state, { errors: [{ key: key, description: error }, ...state.errors] })

  }
});