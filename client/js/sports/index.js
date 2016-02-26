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
    const { count, params: { id } } = this.props;

    return (
      <div className="sports card">
        <ul className="unstyled">
          <li><a href={ router.link('app.party') }>Ping pong</a></li>
          <li><a href={ router.link('app.party') }>Babyfoot</a></li>
          <li><a href={ router.link('app.party') }>Chess</a></li>
        </ul>
      </div>
    );
  }

});

function incrementBy10() { incrementBy(10) }

export default connect(Sports, store, (state): count => (
  { count: state.count }
));