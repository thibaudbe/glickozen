import React from "react";
import {api as router} from "abyssa";
import connect from "fluxx/lib/ReactConnector";
import store from "../store";


const Nav = React.createClass({

  getInitialState() {
    return {
      pendings: []
    }
  },

  render() {
    const { pendings } = this.state;
    const pendingLength = pendings !== 0
      ? <button className="notif" onClick={ () => router.transitionTo('app.pendings') }>{ pendings.length }</button>
      : undefined;

    return (
      <nav className="nav">
        <a href={ router.link('app.sports') }>sports</a>
        <a href={ router.link('app.pendings') }>pendings</a>
        <a href="#" onClick={ this.onLogout }>logout</a>
        { pendingLength }
      </nav> 
    );
  },

  onLogout(e) {
    e.preventDefault();
    gapi.auth2.getAuthInstance().signOut().then(() => router.transitionTo('app.login'));
  }

});


export default connect(Nav, store, (state): count => (
  { count: state.count }
));