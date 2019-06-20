import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Ball } from './UserSignIn';
import ReactMarkdown from 'react-markdown/with-html'

class CourseDetails extends Component {
  constructor(props) {
    super(props)
    this.handleCourseDelete = this.handleCourseDelete.bind(this);
    this.state = {
      courseContent: "",
      creator: "",
      currentCourse: "",
      redirect: false,
      loader: true,
    }
  }
  componentDidMount(props) { // Loading course details on mount
    return new Promise((resolve, reject) => {
      var target = this.props.match.params;
      target = target.id;
      this.setState({
        currentCourse: target
      });
      fetch('http://localhost:5000/api/courses/' + target + '', {
        method: "GET",
        mode: "cors",
      })
        .then((response) => {
          this.setState({
            loader: false
          });
          if (response.status === 400) {
            this.setState({
              redirect: true
            })
          }
          else if (response.status === 200) {
            response.json().then((responseJson) => {
              resolve(responseJson)
              if (responseJson[0].User) { //IF there's a user, set course content and creator
                this.setState({
                  courseContent: responseJson,
                  creator: responseJson[0].User.emailAddress
                })
              }
            })
          }
        })
        .catch((error) => {
          reject(error);
          this.props.history.push("/error");
        })
    })
  }
  handleCourseDelete(e, props) {
    e.preventDefault();
    var target = this.state.currentCourse; // current course ID
    var user = this.props.user; // current user
    var pass = this.props.password; // current password
    var retVal = window.confirm("Are you sure you wish to delete this course?");

    if (retVal === false) {
      return false;
    } else {

      return new Promise((resolve, reject) => {
        fetch('http://localhost:5000/api/courses/' + target + '', {
          method: "DELETE",
          headers: {
            'Authorization': 'Basic ' + btoa(user + ':' + pass),
            'Content-Type': 'application/json'
          }
        })
          .then((response) => {
            if (response.status === 200) {
              this.props.history.push("/")
            }
            response.json().then((responseJson) => {
              resolve(responseJson)
            })
          })
          .catch((error) => {
            this.props.history.push("/error")
            reject(error);
          })
      })
    }
  }

  render(props) {

    //course content variables

    var title = "";
    var description = "";
    var materialsNeeded = "";
    var estimatedTime = "";
    var id = "";
    var firstName = "";
    var lastName = "";

    //mapping course content variables

    Object.entries(this.state.courseContent).map(([key, value], i) => {
      id = value.id
      title = value.title;
      description = value.description;
      materialsNeeded = value.materialsNeeded;
      estimatedTime = value.estimatedTime;
      firstName = value.User.firstName;
      lastName = value.User.lastName;
    })

    //if course not found, redirect to not found

    if (this.state.redirect) {
      this.props.history.push("/notfound");
    }
    return (

      <div className="bounds">
        <div className="actions--bar">
          <div className="bounds">
            <div className="grid-100">
              {/* If course creator is the person logged in, show delete and update button */}
              {(this.props.user === this.state.creator)
                ? <span>
                  <NavLink className="button" to={`/courses/${id}/update`}>Update Course</NavLink>
                  <button className="button" onClick={this.handleCourseDelete}>Delete Course</button>
                </span>
                : ""
              }
              <NavLink className="button button-secondary" to="/">Return to List</NavLink>
            </div>
          </div>
        </div>
        <div className="bounds course--detail">
          {
            (this.state.loader)
              ? <Ball />
              : ""
          }
          <div className="grid-66">
            <div className="course--header">
              <h4 className="course--label">Course</h4>
              <h3 className="course--title">{title}</h3>
              <p>{firstName} {lastName}</p>
            </div>
            <div className="course--description">
            {/* //Madkdown */}
              <ReactMarkdown source={description} />
            </div>
          </div>
          <div className="grid-25 grid-right">
            <div className="course--stats">
              <ul className="course--stats--list">
                <li className="course--stats--list--item">
                  <h4>Estimated Time</h4>
                  <h3>{estimatedTime}</h3>
                </li>
                <li className="course--stats--list--item">
                  <h4>Materials Needed</h4>
                  {/* //Markdown */}
                  <ReactMarkdown source={materialsNeeded} />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );

  }
}

export default CourseDetails;
