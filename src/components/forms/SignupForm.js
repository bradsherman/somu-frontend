import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Form, Button, Message } from 'semantic-ui-react';
import isEmail from 'validator/lib/isEmail';
import InlineError from '../messages/InlineError';

class SignupForm extends Component {
  state = {
    data: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: ''
    },
    errors: {},
    loading: false
  }

  validate = data => {
    const errors = {};

    if (!isEmail(data.email)) errors.email = "Invalid email.";
    if (!data.password) errors.password = "Can't be blank.";
    return errors;
  }

  onChange = e => {
    this.setState({
      ...this.state,
      data: { ...this.state.data, [e.target.name]: e.target.value }
    });
  }

  onSubmit = (e) => {
    e.preventDefault();
    const errors = this.validate(this.state.data);
    this.setState({ errors });
    if (Object.keys(errors).length === 0) {
      this.setState({ loading: true });
      this.props.submit(this.state.data)
        .catch(err => {
          console.log(err);
          return this.setState({ errors: err.response.data.errors, loading: false })
        });
    }
  }

  render() {
    const { data, errors, loading } = this.state;
    return (
      <Form onSubmit={this.onSubmit} loading={loading}>
        { errors.global &&
          <Message negative>
            <Message.Header>Something went wrong</Message.Header>
            <p>{errors.global}</p>
          </Message>
        }
        <Form.Field error={!!errors.firstName}>
          <label htmlFor="firstName">First Name</label>
          <input type="text" id="firstName" name="firstName" placeholder="John" value={data.firstName} onChange={this.onChange} />
        </Form.Field>

        <Form.Field error={!!errors.lastName}>
          <label htmlFor="lastName">Last Name</label>
          <input type="text" id="lastName" name="lastName" placeholder="Doe" value={data.lastName} onChange={this.onChange} />
        </Form.Field>

        <Form.Field error={!!errors.username}>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" placeholder="username" value={data.username} onChange={this.onChange} />
        </Form.Field>

        <Form.Field error={!!errors.email}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" placeholder="example@email.com" value={data.email} onChange={this.onChange} />
          {errors.email && <InlineError text={errors.email} />}
        </Form.Field>

        <Form.Field error={!!errors.password}>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={data.password} onChange={this.onChange} />
          {errors.password && <InlineError text={errors.password} />}
        </Form.Field>
        <Button primary>Sign Up</Button>
        <Link to="/login"><Button>Login</Button></Link>
      </Form>
    );
  }
}

SignupForm.propTypes = {
  submit: PropTypes.func.isRequired
};

export default SignupForm;
