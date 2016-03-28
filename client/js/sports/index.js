import React from 'react';
import { api as router } from 'abyssa';
import connect from 'fluxx/lib/ReactConnector';

import store from '../store';
import { checkCookie } from '../util/cookie';

const Sports = React.createClass({
  
  render() {
    const id = 'sports';
    const { sports } = this.props;

    return (
      <div id={ id } className="card">
        <ul className="unstyled">
          { sportsList(sports) }
        </ul>
      </div>
    );
  }

});

function sportsList(sports) {
  return sports.map((sport, index) => {
    return (
      <li key={ index }>
        <a href={ router.link('app.score', { type: sport }) }>{ sport }</a>
      </li>
    )
  });
}

export default connect(Sports, store, (state): e => ({ 
  sports: state.sports
}));