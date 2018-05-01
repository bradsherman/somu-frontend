import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Form, Button, Message } from 'semantic-ui-react';
import Validator from "validator";
import InlineError from '../messages/InlineError';

class JoinRoomForm extends Component {

  state = {
    data: {
      id: null,
    },
    loading: false,
    errors: {}
  };

  onChange = e => this.setState({
    data: { ...this.state.data, [e.target.name]: e.target.value }
  });

  onSubmit = () => {
    const errors = this.validate(this.state.data);
    this.setState({ errors });
    if (Object.keys(errors).length === 0) {
      this.setState({ loading: true });
      this.props
        .submit(this.state.data)
        .catch(err => { this.setState({ errors: err.response.data.errors, loading: false })});
    }
  };

  validate = (data) => {
    const errors = {};
    if (!data.id) errors.id = "Can't be blank.";
    return errors;
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
        <Form.Field error={!!errors.id}>
          <label htmlFor="email">Room ID</label>
          <input
            type="text"
            id="room_id"
            name="room_id"
            placeholder="room id"
            value={data.id}
            onChange={this.onChange}
          />
          {errors.id && <InlineError text={errors.id}/>}
        </Form.Field>
        <Button primary>Join</Button>
        <Link to="/dashboard"><Button>Dashboard</Button></Link>
      </Form>
    )
  }
}

JoinRoomForm.propTypes = {
  submit: PropTypes.func.isRequired
};

export default JoinRoomForm;
