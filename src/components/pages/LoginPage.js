import React, { Component } from 'react'
import LoginForm from '../forms/LoginForm';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
import api from '../../api';

class LoginPage extends Component {

  submit = data =>
    // this.props.login(data).then(() => window.location.assign("http://52.4.91.6:3000/spotify/auth/login"))
    this.props.login(data).then(() => window.location.assign(api.api_url+"/spotify/auth/login"))

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
