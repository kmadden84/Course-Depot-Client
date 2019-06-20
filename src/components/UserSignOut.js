import { Component } from 'react';

class UserSignOut extends Component {
  componentDidMount(props) {
    this.props.signout();
  }
  componentDidUpdate(props) {
    this.props.signout();
  }
  render() {
    return (null)
  }
}
export default UserSignOut;