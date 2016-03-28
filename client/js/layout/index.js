import React from 'react';
import { api as router } from 'abyssa';
import connect from 'fluxx/lib/ReactConnector';
import { get } from '../util/ajax';
import { isLogged, showScore } from '../store/action';

import store, { contacts } from '../store';
import Nav from '../nav';
import Score from '../score';


const Layout = React.createClass({

  componentWillMount() {
    get('/api/login')
      .then(e => {
        isLogged(true);
        router.transitionTo('app.sports');
      })
      .catch(x => router.transitionTo('app.login'))
  },

  render() {
    const { contacts, _isLogged, _showScore } = this.props;
    const navElt = _isLogged ? <Nav /> : undefined;
    const scoreElt = _showScore ? <Score contacts={ contacts } /> : undefined;

    return (
      <div>
        { navElt }
        <main>
          { scoreElt }
          <button id='btnScore' onClick={ () => showScore(true) }>+</button>
          { this.props.children }
        </main>
      </div>
    );
  }

});

export default connect(Layout, store, (state): e => ({ 
  _isLogged: state._isLogged,
  _showScore: state._showScore,
  contacts: state.contacts
}));
