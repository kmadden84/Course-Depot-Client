import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import {Ball} from './UserSignIn';

class Courses extends Component {
  constructor(props) {
    super(props)
    this.state = {
      courseContent: "",
      loader: true
    }
  }
  componentDidMount(props) {
    return new Promise((resolve, reject) => {
      fetch("https://km-rest-api.herokuapp.com/api/courses", {
        method: "GET",
        mode: "cors",
      })
        .then((response) => {
          this.setState({
            loader: false
          });
          if (response.status === 200) {
            this.setState({
              successful: true
            });
          }
          response.json().then((responseJson) => {
            resolve(responseJson)
            if (responseJson) {
              this.setState({
                courseContent: responseJson
              });
            }
          })
        })
        .catch((error) => {
          reject(error);
          this.props.history.push("/error")
        })
    })
  }
  render(props) {
    var courseTile = [];

    //mapping coure content, pushing HTML to courseTile

    for (var i = 0; i < this.state.courseContent.length; i++) {
      var id = this.state.courseContent[i].id;
      var title = this.state.courseContent[i].title;
      courseTile.push(
        <div className="grid-33" key={i}>
          <NavLink className="course--module course--link" to={`/courses/${id}/`}>
            <h4 className="course--label">Course</h4>
            <h3 className="course--title">{title}</h3>
          </NavLink>
        </div>
      )
    }
    return (
      <div className="bounds">
      {
        (this.state.loader)
        ? <Ball />
        : ""
      }
        {/* rendering course tiles */}
        {courseTile}
        <div className="grid-33">
          <NavLink className="course--module course--add--module" to="/courses/create">
            <h3 className="course--add--title">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 13 13" className="add">
                <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
              </svg>New Course</h3>
          </NavLink>
        </div>
      </div>
    );
  }
}

export default Courses;
