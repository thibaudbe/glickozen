import React from "react";
import { api as router } from 'abyssa';
import Nav from "../nav";
import { get } from "../util/ajax";

export default React.createClass({

  componentWillMount() {
      get('/api/login').then(
        succ => router.transitionTo('app.sports'),
        err => router.transitionTo('app.login')
      )
  },

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
