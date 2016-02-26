import React from 'react';
import { api as router } from 'abyssa';

import Nav from '../nav';


export default React.createClass({

  render() {
    return (
      <div>
        <Nav />
        <main>
          { this.props.children }
        </main> 
      </div> 
    );
  }

});