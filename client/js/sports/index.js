import React from 'react';
import { api as router } from 'abyssa';
import connect from 'fluxx/lib/ReactConnector';

import store  from '../store';

const Sports = React.createClass({
  
  render() {
    const { count, sports, params: { id } } = this.props;
    return (
      <div className="sports card">
        <ul className="unstyled">{
          sports.map((sport, index) => (
            <li key={ index }>
              <a href={ router.link('app.score', { type: sport }) }>{ sport }</a>
            </li>
          ))
        }</ul>
      </div>
    );
  }

});

export default connect(Sports, store, (state): count => (
  { 
    count: state.count, 
    sports: state.sports
  }
));