import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SignupForm from '../forms/SignupForm';
import { signup } from '../../actions/users';

class SignupPage extends Component {
  submit = (data) => this.props.signup(data).then(() =>
    window.location.assign("http://52.4.91.6:3000/spotify/auth/login"));
  render() {
    return (
      <div>
        <h1>Signup Page</h1>
        <SignupForm submit={this.submit} />
      </div>
    );
  }
}

SignupPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  signup: PropTypes.func.isRequired
};

export default connect(null, { signup })(SignupPage);
