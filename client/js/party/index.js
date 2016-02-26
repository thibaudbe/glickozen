import React from 'react';
import { api as router } from 'abyssa';
import { checkCookie } from '../util/cookie';


export default React.createClass({

  componentWillMount() {
    checkCookie('username')
      .catch(res => router.transitionTo('app.login'))
  },

  render() {
    return (
      <div className="party">
        <form onSubmit={ this.onSubmit }>
          <div className="field">
            <label htmlFor="opponent">Opponent</label>
            <input type="text" name="opponent" />
          </div>
          <div className="field">
            <label htmlFor="date">Date</label>
            <input type="date" name="date" />
          </div>
          <div className="field">
            <button type="submit" name="playerScore" data-value="1">Win</button>
            <button type="submit" name="playerScore" data-value="0">Lose</button>
            <button type="submit" name="playerScore" data-value="0.5">Draw</button>
          </div>
        </form> 
      </div> 
    );
  },

  onSubmit(e) {
    e.preventDefault();
    console.log('create party');
  }

});