import React from 'react';
import { api as router } from 'abyssa';
import connect from 'fluxx/lib/ReactConnector';

import store, { incrementBy } from '../store';


class Home extends React.Component {

  render() {
    const { count, params: { id } } = this.props;

    return (
      <div>
        <h1>hello world</h1>
        <p>
          <button type="button" onClick={ incrementBy10 }>Increment:</button>
          {' '}
          { count }
        </p>
      </div>
    );
  }

}

function incrementBy10() { incrementBy(10) }

export default connect(Home, store, (state): count => (
  { count: state.count }
));