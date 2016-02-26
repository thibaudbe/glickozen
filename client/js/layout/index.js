import React from 'react';
import { api as router } from 'abyssa';


export default React.createClass({

  render() {
    return (
      <main>
        {this.props.children}
      </main> 
    );
  }

});