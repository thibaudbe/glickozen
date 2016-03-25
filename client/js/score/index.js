import React from "react";
import MultiSelect from "react-select";
import {post, get} from "../util/ajax";
import {api as router} from "abyssa";
import moment from "moment";


export default React.createClass({

  componentDidMount() {
    get('/api/getContacts')
      .then(
        succ => {
          console.log(succ);
          this.setState({ data: succ.data.map(item => {
          return { value: item.email, label: item.name };
        }) })
      },
        err => {
          console.log(err);
          this.setState({ data: [] })
        }
      );
  },

  getInitialState() {
    return {
      data: [],
      date: moment().format("DD/MM/YYYY"),
      opponent: []
    }
  },

  onChange(field) {
    return (e) => {
      if (field === "opponent" || field === "team1") {
        const values = e.split(",");
        this.setState({ [field]: values });
      } else this.setState({[field]: e.target.value});
    }
  },
  
  render() {
    return (
      <div className="score card">
        <div className="field">
          <label htmlFor="team1">My team</label>
          <MultiSelect
            multi
            simpleValue
            disabled={ false }
            autoload={ false }
            options={ this.state.data }
            clearable={ true }
            searchable={ true }
            value={ this.state.opponent.toString() }
            onChange={ this.onChange("team1") }
            placeholder="Select your opponents..."
            noResultsText="Aucun résultat"
          />
        </div>
        <div className="field">
          <label htmlFor="team2">Opponent</label>
          <MultiSelect
            multi
            simpleValue
            disabled={ false }
            autoload={ false }
            options={ this.state.data }
            clearable={ true }
            searchable={ true }
            value={ this.state.opponent.toString() }
            onChange={ this.onChange("opponent") }
            placeholder="Select your opponents..."
            noResultsText="Aucun résultat"
          />
        </div>
        <div className="field">
          <label htmlFor="date">Date</label>
          <input ref="date" type="date" value={ this.state.value } onChange={ this.onChange("date") } name="date" />
        </div>
        <div className="field">
          <button ref="win" type="button" className="btn" onClick={ this.onSubmit(1) } data-value="1">Win</button>
          <button ref="lose" type="button" className="btn" onClick={ this.onSubmit(0) } data-value="0">Lose</button>
          <button ref="draw" type="button" className="btn secondary" onClick={ this.onSubmit(0.5) } data-value="0.5">Draw</button>
        </div>
      </div>
    );
  },

  onSubmit(score) {
    return () => {
      const team1 = this.state.team1;
      const team2 = this.state.opponent;
      const date = moment(this.state.date, "YYYY-MM-DD");

      const data = {
        team1: team1,
        team2: team2,
        date: date,
        playerScore: score,
        confirmed: false,
        sport: 'pingpong'
      };
      
      post('/api/games', data)
        .then(res => router.transitionTo('app.sports'));
    }
  }

});
