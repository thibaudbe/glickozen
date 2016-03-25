import React from "react";
import Nav from "../nav";


export default React.createClass({

  // getInitialState() {
  //   return {
  //     logged: false
  //   }
  // },

  // componentWillMount() {
  //   getCookie('username')
  //     .then(res => this.setState({ logged: true }))
  //     .catch(res => this.setState({ logged: false }))

  // },

  render() {
    // const { logged } = this.state;
    // const isLogged = logged === true ? <Nav/> : undefined;

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
