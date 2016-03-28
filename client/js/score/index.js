import React from 'react';
import { api as router } from 'abyssa';
import connect from 'fluxx/lib/ReactConnector';
import { post, get } from '../util/ajax';
import { contacts } from '../store';
import { showScore } from '../store/action';

import MultiSelect from 'react-select';
import moment from 'moment';


export default React.createClass({

  getInitialState() {
    return {
      opponent: [],
      team1: []
    }
  },

  componentDidMount() {
    get('/api/getContacts')
      .then(e => {
        contacts.map(item => {
          return {
            value: item.email, 
            label: item.name 
          }
        })
      })
  },

  render() {
    const id = 'score';
    const { contacts } = this.props;
    const { team1, opponent, value } = this.state;

    const multiSelectValue = [{ 
      id: 'team1', 
      label: 'My team', 
      value: team1.toString(), 
      placeholder: 'Select your team' 
    },{
      id: 'team2', 
      label: 'Opponents', 
      value: opponent.toString(), 
      placeholder: 'Select the opponent team' 
    }];

    const multiSelectElt = multiSelectValue.map((item, index) => {
      const { id, label, value, placeholder } = item;

      return (
        <div key={ index } className="field">
          <label htmlFor={ id }>{ label }</label>
          <MultiSelect
            multi
            simpleValue
            disabled={ false }
            autoload={ false }
            options={ contacts }
            clearable={ true }
            searchable={ true }
            value={ value }
            onChange={ () => this.onChange(id) }
            placeholder={ placeholder }
            noResultsText="Aucun résultat"
          />
        </div>
      );
    });

    return (
      <div id={ id } className="card">
        <button onClick={ () => showScore(false) }>Close score form</button>
        { multiSelectElt }
        <div className="field">
          <label htmlFor="date">Date</label>
          <input ref="date" type="date" value={ value } onChange={ () => this.onChange('date') } name="date" />
        </div>
        <div className="field">
          <button ref="win" type="button" className="btn" onClick={ () => this.onSubmit(1) } data-value="1">Win</button>
          <button ref="lose" type="button" className="btn" onClick={ () => this.onSubmit(0) } data-value="0">Lose</button>
          <button ref="draw" type="button" className="btn secondary" onClick={ () => this.onSubmit(0.5) } data-value="0.5">Draw</button>
        </div>
      </div>
    );
  },

  onSubmit(score) {
    const { team1, opponent, date } = this.state;
    // moment(date, 'YYYY-MM-DD');

    const data = {
      team1: team1,
      team2: opponent,
      date: 1456502889847,
      team1Score: score,
      confirmed: false,
      sport: 'pingpong'
    };

    post('/api/games', data)
      .then(res => router.transitionTo('app.sports'));
  },

  onChange(field) {
    if (field === 'opponent' || field === 'team1') {
      const values = e.split(',');
      this.setState({ [field]: values });
    } else this.setState({ [field]: e.target.value });
  }

});

// export default connect(Score, store, (state): e => ({ 
//   contacts: state.contacts
// }));
