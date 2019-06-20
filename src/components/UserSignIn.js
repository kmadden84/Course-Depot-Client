import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import {keyframes} from 'styled-components';
import styled from 'styled-components';

//Exporting Loading Animation

export const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

//Exporting Loading Animation

export const Ball = styled.div`
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid blue;
  border-right: 16px solid green;
  border-bottom: 16px solid red;
  width: 30px;
  height: 30px;
  -webkit-animation: spin 2s linear infinite;
  animation: ${spin} 2s linear infinite;
  position: relative;
  left: 47%;
  top: 200px;
`;

class UserSignIn extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.userdata(this.email.value, this.pass.value) //passing sign-in state to App, for global use
  }
  render(props) {
    return (
      <div className="bounds" >
      {
        (this.props.loader)
        ? <Ball /> //Loader
        : ""
      }
        <div className="grid-33 centered signin">
          <h1>Sign In</h1>
          <div>
            <form>
              <div>
                <input
                  name="emailAddress"
                  ref={(input) => this.email = input}
                  type="text"
                  placeholder="Email Address"
                />
              </div>
              <div>
                <input
                  name="password"
                  ref={(input) => this.pass = input}
                  type="password"
                  placeholder="Password"
                />
              </div>
              <div className="grid-100 pad-bottom">
                <button className="button" type="submit" onClick={this.handleSubmit}>Sign In</button>
                <NavLink className="button" to="/" >Cancel</NavLink>
              </div>
            </form>
          </div>
          <p>&nbsp;</p>
          <p>Don't have a user account? <NavLink to="/signup">Click here</NavLink> to sign up!</p>
        </div>
      </div>
    )
  }
}
export default UserSignIn;

