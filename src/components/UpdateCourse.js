import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class UpdateCourse extends Component {
  constructor(props) {
    super(props)
    this.handleCourseUpdate = this.handleCourseUpdate.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      courseContent: "",
      creator: "",
      currentCourse: "",
      title: "",
      description: "",
      materialsNeeded: "",
      estimatedTime: "",
      firstName: "",
      lastName: "",
    }
  }
  componentDidMount(props) {
    return new Promise((resolve, reject) => {
      var target = this.props.match.params;
      target = target.id;
      var user = this.props.user;

      this.setState({
        currentCourse: target
      });

      fetch('https://km-rest-api.herokuapp.com/api/courses/' + target + '', {
        method: "GET",
        mode: "cors",
      })
        .then((response) => {
          if (response.status === 200) {
            this.setState({
              successful: true
            });
          }
          response.json().then((responseJson) => {
            resolve(responseJson)
            if (responseJson) {
              this.setState({
                courseContent: responseJson,
                creator: responseJson[0].User.emailAddress
              });
            }
            if (this.props.user !== this.state.creator) {
              // alert('Only the content creator may update this course')
              this.props.history.push("/forbidden");
             }
             //setting states to manage course fields
            Object.entries(this.state.courseContent).map(([key, value], i) => {
              this.setState({
                title: value.title,
                description: value.description,
                materialsNeeded: value.materialsNeeded,
                estimatedTime: value.estimatedTime,
                firstName: value.User.firstName,
                lastName: value.User.lastName
              })
            })
          })
        })
        .catch((error) => {
          reject(error);
        })
    })
  }
  handleCourseUpdate(e, props) {
    e.preventDefault();
    var target = this.state.currentCourse;
    var user = this.props.user;
    var pass = this.props.password;

    if (this.props.user !== this.state.creator) {
     // alert('Only the content creator may update this course')
     this.props.history.push("/forbidden");
    }
    else {
      //update request
      return new Promise((resolve, reject) => {
        fetch('https://km-rest-api.herokuapp.com/api/courses/' + target + '', {
          method: "PUT",
          headers: {
            'Authorization': 'Basic ' + btoa(user + ':' + pass),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "title": this.title.value,
            "description": this.description.value,
            "estimatedTime": this.time.value,
            "materialsNeeded": this.materials.value
          })
        })
          .then((response) => {
            if (response.status === 200) {
              alert('The Course has been updated');
              this.props.history.push("/");
            }
            //if update unsuccessful, alert why
            else {
              response.json().then((responseJson) => {
                alert(responseJson.Error);
                resolve(responseJson)
              })
            }
          })
          .catch((error) => {
            reject(error);
          })
      }).catch(error => console.log('An error occured ', error))
    }
  }
  handleChange(e) {
    //allowing input values to be dynamically changed.s
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  render(props) {
    return (
      <div className="bounds">
        <div className="bounds course--detail">
          <h1>Update Course</h1>
          <div>
            <form>
              <div className="grid-66">
                <div className="course--header">
                  <h4 className="course--label">Course</h4>
                  <div><input id="title"
                    name="title"
                    type="text"
                    className="input-title course--title--input"
                    placeholder={this.state.title}
                    ref={(input) => this.title = input}
                    onChange={this.handleChange}
                    value={this.state.title} />
                  </div>
                  <p>By {this.state.firstName} {this.state.lastName} </p>
                </div>
                <div className="course--description">
                  <div>
                    <textarea id="description"
                      name="description"
                      className=""
                      placeholder={this.state.description}
                      ref={(input) => this.description = input}
                      onChange={this.handleChange}
                      value={this.state.description}>
                      {this.state.description}</textarea>
                  </div>
                </div>
              </div>
              <div className="grid-25 grid-right">
                <div className="course--stats">
                  <ul className="course--stats--list">
                    <li className="course--stats--list--item">
                      <h4>Estimated Time</h4>
                      <div><input
                        id="estimatedTime"
                        name="estimatedTime"
                        type="text"
                        className="course--time--input"
                        placeholder={this.state.estimatedTime}
                        ref={(input) => this.time = input}
                        onChange={this.handleChange}
                        value={this.state.estimatedTime} />
                      </div>
                    </li>
                    <li className="course--stats--list--item">
                      <h4>Materials Needed</h4>
                      <div><textarea id="materialsNeeded"
                        name="materialsNeeded"
                        className=""
                        placeholder={this.state.materialsNeeded}
                        ref={(input) => this.materials = input}
                        onChange={this.handleChange}
                        value={this.state.materialsNeeded}>
                        {this.state.materialsNeeded}
                      </textarea>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="grid-100 pad-bottom">
                <button className="button" type="submit" onClick={this.handleCourseUpdate}>Update Course</button>
                <NavLink className="button" to="/" >Cancel</NavLink>
              </div>

            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default UpdateCourse;