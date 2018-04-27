import React, { Component } from 'react'
import LoginForm from '../forms/LoginForm';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';

class LoginPage extends Component {

  submit = data =>
    this.props.login(data).then(() => window.location.assign("http://34.193.174.233:3000/spotify/auth/login"))

  render() {
    return (
      <div>
        <h1>Login Page</h1>
        <LoginForm submit={this.submit}/>
      </div>
    )
  }
}

LoginPage.propTypes = {
  login: PropTypes.func.isRequired
};

export default connect(null, { login })(LoginPage);
