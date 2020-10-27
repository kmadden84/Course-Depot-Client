import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import {Ball} from './UserSignIn';

class UserSignUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loader: false
    }
    this.createUser = this.createUser.bind(this);
  }
  createUser(e, props) {
    this.setState({
      loader:true,
    });
    e.preventDefault();

    //validating that all fields are entered
    if (!this.firstName.value || !this.lastName.value || !this.emailAddress.value || !this.pass.value) {
      alert('Required Fields Missing')
      this.setState({
        loader:false,
      });
    }

    else {
      return new Promise((resolve, reject) => {
        fetch('https://km-rest-api.herokuapp.com/api/users/', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "firstName": this.firstName.value,
            "lastName": this.lastName.value,
            "emailAddress": this.emailAddress.value,
            //validating that password matches confirm pass before it's passed to post request
            "password": (this.pass.value !== this.passConfirm.value) ? alert('passwords dont match') : this.pass.value
          })
        })
          .then((response) => {
            this.setState({
              loader: false
            });
            if (response.status === 200) {
            //if signup successful, pass login credentials to global state
              this.props.userdata(this.emailAddress.value, this.pass.value)
              this.props.history.push("/");
            }
            else {
              response.json().then((responseJson) => {
                resolve(responseJson)
                alert(responseJson.Error);
              })
            }
          })
          .catch((error) => {
            reject(error);
            this.props.history.push("/error")
          })
      })
    }
  }
  render(props) {
    return (
      <div className="bounds">
        <div className="grid-33 centered signin">
        {
        (this.state.loader)
        ? <Ball />
        : ""
        }
          <h1>Sign Up</h1>
          <div>
            <form>
              <div><input id="firstName" name="firstName" type="text" className="" placeholder="First Name" ref={(input) => this.firstName = input} /></div>
              <div><input id="lastName" name="lastName" type="text" className="" placeholder="Last Name" ref={(input) => this.lastName = input} /></div>
              <div><input id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" ref={(input) => this.emailAddress = input} /></div>
              <div><input id="password" name="password" type="password" className="" placeholder="Password" ref={(input) => this.pass = input} /></div>
              <div><input id="confirmPassword" name="confirmPassword" type="password" className="" placeholder="Confirm Password" ref={(input) => this.passConfirm = input} /></div>
              <div className="grid-100 pad-bottom"><button className="button" type="submit" onClick={this.createUser}>Sign Up</button>
                <NavLink className="button button-secondary" to="/">Cancel</NavLink></div>
            </form>
          </div>
          <p>&nbsp;</p>
          <p>Already have a user account? <NavLink to="/signin">Click here</NavLink> to sign in!</p>
        </div>
      </div>
    );

  }
}

export default UserSignUp;
