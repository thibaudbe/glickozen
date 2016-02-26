import React from 'react';
import { api as router } from 'abyssa';


export default React.createClass({

  render() {
    return (
      <div className="login">
        <form>
          <div className="field">
            <label htmlFor="username">Trigramme</label>
            <input type="text" name="username" />
          </div>
          <button type="submit">Let's go</button>
        </form> 
      </div> 
    );
  },

  onSubmit(e) {
    e.preventDefault();
    console.log('login');
  }

});