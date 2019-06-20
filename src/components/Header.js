import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Header extends Component {
  render(props) {
    var userData = []
    Object.keys(this.props.currentState).map(i =>
      userData.push(this.props.currentState[i])
    )
    console.log('header')
    return (
      <div className="header">
        <div className="bounds">
          <h1 className="header--logo">Courses</h1>
          <nav>
            {
              (this.props.currentState.emailAddress !== "")
                ? <span>Welcome {userData[2]} {userData[3]}!</span>
                : <NavLink to='/signup' className="signup">Sign Up</NavLink>
            }
            {
              (this.props.currentState.emailAddress !== "")
                ? <NavLink to='/signout' className="signout">Sign Out</NavLink>
                : <NavLink to='/signin' className="signin">Sign In</NavLink>
            }
          </nav>
        </div>
      </div>
    );
  }
}
export default Header;