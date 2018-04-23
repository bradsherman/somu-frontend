import React, { Component } from 'react'
import LoginForm from '../forms/LoginForm';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
// import { withRouter } from 'react-router-dom';

class LoginPage extends Component {

  submit = data =>
    // this.props.login(data).then(() => this.props.history.push("/"))
    this.props.login(data).then(() => window.location.assign("http://35.171.74.240:3000/spotify/auth/login"))

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
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  login: PropTypes.func.isRequired
};

// export default connect(null, { login })(withRouter(LoginPage));
export default connect(null, { login })(LoginPage);