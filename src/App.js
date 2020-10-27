import React, { Component } from 'react';
import Courses from './components/Courses';
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import CourseDetails from './components/CourseDetails';
import CreateCourse from './components/CreateCourse';
import UpdateCourse from './components/UpdateCourse';
import UserSignOut from './components/UserSignOut';
import NoResults from './components/NoResults';
import Forbidden from './components/Forbidden';
import Header from './components/Header';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import { createBrowserHistory } from 'history'



export const history = createBrowserHistory();


class App extends Component {



  constructor(props) {
    super(props)
    this.state = {
      emailAddress: (Cookies.get("name")) ? Cookies.get("name") : "",
      password: (Cookies.get("password")) ? Cookies.get("password") : "",
      firstName: (Cookies.get("firstName")) ? Cookies.get("firstName") : "",
      lastName: (Cookies.get("lastName")) ? Cookies.get("lastName") : "",
      detailsLoader: ""
    }
    console.log(this.state.emailAddress)
    this.signIn = this.signIn.bind(this);
    this.clearState = this.clearState.bind(this);
    this.redirectToHome = this.redirectToHome.bind(this);

  }
  redirectToHome = () => {
    console.log('redirect');
    const { history } = this.props;
    console.log(history);

    if (history) history.push('/');
  }
  signIn = (user, pass) => {
    this.setState({
      loader: true,
    });
    return new Promise((resolve, reject) => {
      fetch("https://km-rest-api.herokuapp.com/api/users", {
        method: "GET",
        mode: 'cors',
        headers: new Headers({
          'Authorization': 'Basic ' + btoa(user + ':' + pass)
        }),
      })
        .then((response) => {
          this.setState({
            loader: false,
          });

          response.json().then((responseJson) => {
            console.log(response.status)
            if (response.status === 200) {
              Cookies.set('name', user, { path: '/' });
              Cookies.set('password', pass, { path: '/' });
              this.setState({
                emailAddress: user,
                password: pass
              });
              this.redirectToHome();

              Cookies.set('firstName', responseJson["First Name"], { path: '/' });
              Cookies.set('lastName', responseJson["Last Name"], { path: '/', });
              this.setState({
                firstName: responseJson["First Name"],
                lastName: responseJson["Last Name"]
              })
            }
            else if (response.status === 401) {
              alert(responseJson.Error)
            }
            else {
              if (this.props.history.location.pathname !== "/signin") {
                this.props.history.goBack()
              } else {
                this.props.history.push("/");
              }
            }
          })
        }).catch((error) => {
          reject(error);
          //redirect to error page
          this.props.history.push("/error");
        })
    })
  }
  clearState = (props) => {
    this.setState({
      emailAddress: "",
      password: "",
      firstName: "",
      lastName: ""
    });
    Object.keys(Cookies.get()).forEach(function (cookieName) {
      var neededAttributes = { path: '' };
      Cookies.remove(cookieName, neededAttributes);
    });

    this.props.history.push("/signin");
  }

  render(props) {
    const PrivateRoute = ({ component: Component, ...rest }) => (
      //setting private Routes
      <Route {...rest} render={(props) => (
        this.state.emailAddress !== ""
          ? <Component {...props} password={this.state.password} user={this.state.emailAddress} />
          : <Redirect to='/signin' />
      )} />
    )
    return (
      <div>
        <Route path="*" render={(props) => <Header currentState={this.state} signout={this.clearState} {...props} />} />
        <Switch>
          <Route exact path="/" render={(props) => <Courses {...props} />} />
          <Route path={`${this.props.match.path}signout`} exact={true} render={(props) => <UserSignOut signout={this.clearState} {...props} />} />
          <Route path={`${this.props.match.path}signin`} exact={true} render={(props) => <UserSignIn loader={this.state.loader} currentState={this.state} userdata={this.signIn} {...props} />} />
          <PrivateRoute path={`${this.props.match.path}courses/create`} component={CreateCourse} />
          <PrivateRoute exact path={`${this.props.match.path}courses/:id/update`} component={UpdateCourse} />
          <Route exact path={`${this.props.match.path}courses/:id`} render={(props) => <CourseDetails password={this.state.password} user={this.state.emailAddress} {...props} />} />
          <Route exact path={`${this.props.match.path}signup`} render={(props) => <UserSignUp userdata={this.signIn} {...props} />} />
          <Route exact path='/forbidden' exact={true} component={Forbidden} />
          <Route exact path='/error' exact={true} component={Error} />
          <Route path='*' exact={true} component={NoResults} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
