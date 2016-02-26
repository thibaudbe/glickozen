import React from 'react';
import ReactDOM from 'react-dom';
import { api as router } from 'abyssa';
import { checkCookie, getCookie } from '../util/cookie';
import { post } from '../util/ajax';


export default React.createClass({

  componentWillMount() {
    checkCookie('username')
      .catch(res => router.transitionTo('app.login'))
  },

  render() {
    return (
      <div className="party card">
        <div className="field">
          <label htmlFor="opponent">Opponent</label>
          <input ref="opponent" type="text" name="opponent" />
        </div>
        <div className="field">
          <label htmlFor="date">Date</label>
          <input ref="date" type="date" name="date" />
        </div>
        <div className="field">
          <button ref="win" type="button" className="btn" onClick={ this.onSubmit } data-value="1">Win</button>
          <button ref="lose" type="button" className="btn" onClick={ this.onSubmit } data-value="0">Lose</button>
          <button ref="draw" type="button" className="btn secondary" onClick={ this.onSubmit } data-value="0.5">Draw</button>
        </div>
      </div> 
    );
  },

  onSubmit(e) {
    e.preventDefault();
    const opponent = ReactDOM.findDOMNode(this.refs.opponent).value;
    const date = ReactDOM.findDOMNode(this.refs.date).value;

    var d = new Date();
    var today = d.getTime();

    const data = {
      opponent, 
      date: 1456502889847,
      player: getCookie('username'),
      playerScore: parseInt(e.target.getAttribute('data-value')),
      confirmed: false,
      sport: 'pingpong'
    }

    return post('/api/games', data)
      .then(res => router.transitionTo('app.sports'));

  }

});