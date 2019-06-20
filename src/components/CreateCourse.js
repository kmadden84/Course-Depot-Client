import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class CreateCourse extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errorMessage: ""
    }
  }
  handleCourseSubmit = (e) => {
    e.preventDefault();
    return new Promise((resolve, reject) => {
      var user = this.props.user;
      var pass = this.props.password;

      fetch("http://localhost:5000/api/courses", {
        method: "POST",
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
          if (response.status === 201) {
            this.setState({
              successful: true
            });
            alert('Course Added');
            //push to course list after course is added
            this.props.history.push("/");
          }
          response.json().then((responseJson) => {
            resolve(responseJson)
            if (responseJson) {
              //set error messages
              this.setState({
                errorMessage: responseJson,
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
    let error = [];
    //mapping error messages, pushing to error variable
    Object.keys(this.state.errorMessage).map(i =>
      error.push(this.state.errorMessage[i])
    )
    return (
      <div className="bounds course--detail">
        <h1>Create Course</h1>
        <div>
          <div>
            <h2 className="validation--errors--label">Validation errors</h2>
            <div className="validation-errors">
              <ul>
                <li>{error}</li>
              </ul>
            </div>
          </div>
          <form>
            <div className="grid-66">
              <div className="course--header">
                <h4 className="course--label">Course</h4>
                <div>
                  <input
                    name="title"
                    ref={(input) => this.title = input}
                    type="text"
                    className="input-title course--title--input"
                    placeholder="Course title..."
                  />
                </div>
                <p>By Joe Smith</p>
              </div>
              <div className="course--description">
                <div>
                  <textarea
                    ref={(input) => this.description = input}
                    name="description"
                    className=""
                    placeholder="Course description...">
                  </textarea>
                </div>
              </div>
            </div>
            <div className="grid-25 grid-right">
              <div className="course--stats">
                <ul className="course--stats--list">
                  <li className="course--stats--list--item">
                    <h4>Estimated Time</h4>
                    <div>
                      <input
                        name="estimatedTime"
                        ref={(input) => this.time = input}
                        type="text"
                        className="course--time--input"
                        placeholder="Hours"
                      />
                    </div>
                  </li>
                  <li className="course--stats--list--item">
                    <h4>Materials Needed</h4>
                    <div>
                      <textarea
                        ref={(input) => this.materials = input}
                        name="materialsNeeded"
                        className=""
                        placeholder="List materials..." >
                      </textarea>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="grid-100 pad-bottom">
              <button className="button" type="submit" onClick={this.handleCourseSubmit}>Create Course</button>
              <NavLink className="button" to="/" >Cancel</NavLink>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default CreateCourse;
