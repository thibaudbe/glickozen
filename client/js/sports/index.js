import React from 'react';
import { api as router } from 'abyssa';
import connect from 'fluxx/lib/ReactConnector';

import store, { incrementBy } from '../store';
import { checkCookie } from '../util/cookie';

const Sports = React.createClass({

  componentWillMount() {
    checkCookie('username')
      .catch(res => router.transitionTo('app.login'))
  },

  render() {
    const { count, sports, params: { id } } = this.props;
    console.log('router', router);
    return (
      <div className="sports card">
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

function incrementBy10() { incrementBy(10) }

export default connect(Sports, store, (state): count => (
  { 
    count: state.count, 
    sports: state.sports
  }
));