import React from 'react';
import { api as router } from 'abyssa';


export default React.createClass({

  render() {
    return (
      <nav className="nav">
        <a href={ router.link('app.sports') }>sports</a>
        <a href={ router.link('app.pendings') }>pendings</a>
        <a href={ router.link('app.party') }>add party</a>
        <a href="#">logout</a>
      </nav> 
    );
  }

});