import React from 'react';
import { replace } from 'immupdate';
import { getCookie } from '../util/cookie';
import { get, put } from '../util/ajax';


export default React.createClass({

  getInitialState() {
    return {
      pendings: []
    }
  },

  componentWillMount() {
    get(`/api/games/pending?player=${getCookie('username')}`)
      .then(list => this.setState({ pendings: list }))

  },

  render() {
    const id = 'pendings';
    const { pendings } = this.state;

    const pendingList = pendings && pendings.length !== 0 
      ? pendings.map((pending, index) => {
        const { date, uuid, player, opponent, sport, playerScore } = pending;
        const newPending = {
          date, opponent, player, playerScore, sport, uuid,
          confirmed: true
        };

        return (
          <li key={ index }>
            ({ sport }) { player } vs. { opponent } : { playerScore } 
            {' '}
            <button onClick={ () => this.onUpdate(newPending) }>TRUE</button>/
            <button onClick={ () => this.onUpdate(pending) }>NOPE</button>
          </li>
        )
      }) : undefined;


    return (
      <div id={ id } className="pendings card">
        <ul className="unstyled">
          { pendingList }
        </ul>
      </div> 
    );
  },

  onUpdate(data) {
    // console.log('data', data);
    put('api/games/confirm', data)
      .then(e => console.log(e))
      .catch(x => console.log(x))
  }

});