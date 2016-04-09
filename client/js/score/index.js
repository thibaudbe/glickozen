import React from 'react';
import { store, actions } from './store';
import MultiSelect from "react-select";
import connect from 'fluxx/lib/ReactConnector';

export const Score = React.createClass({
  propTypes: {
    score: React.PropTypes.shape({
      contacts: React.PropTypes.arrayOf(),
      errors: React.PropTypes.arrayOf(),
      data: React.PropTypes.shape({
        team1: React.PropTypes.arrayOf(),
        team2: React.PropTypes.arrayOf(),
        date: React.PropTypes.string
      })
    })
  },

  componentDidMount() {
    actions.init(this.props.params.type);
  },

  onChange(field) {
    return (e) => actions.onChange(field, e)
  },

  onSubmit(score) {
    return () => actions.submit(score);
  },

  render() {
    const { contacts, errors, data } = this.props.score;
    const multiSelectProps = {
      disabled: false, autoload: false, clearable: true, searchable: true, noResultsText: "Aucun résultat"
    };
    return (
      <div className="score card">
        {
          [{label: "Team 1", name: "team1"}, {label: "Team 2", name: "team2"}].map(({label, name}, index) =>
            <div key={ index } className="field">
              <label htmlFor={ name }>{ label }</label>
              <MultiSelect
                multi
                simpleValue
                options={ contacts }
                value={ data[name].toString() }
                onChange={ this.onChange(name) }
                placeholder={ `Select ${ label }...` }
                { ...multiSelectProps }
              />
            </div>
          )
        }
        <div className="field">
          <label htmlFor="date">Date</label>
          <input ref="date" type="date" value={ data.date } onChange={ this.onChange("date") } name="date"/>
        </div>
        <div className="field">
          <button ref="win" className="btn" onClick={ this.onSubmit(1) }>Win</button>
          <button ref="lose" className="btn" onClick={ this.onSubmit(0) }>Lose</button>
          <button ref="draw" className="btn secondary" onClick={ this.onSubmit(0.5) }>Draw</button>
        </div>
      </div>
    )
  }
});

export default connect(Score, store, state => ({
  score: state
}));
