import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Form, Button, Message } from 'semantic-ui-react';
import Validator from "validator";
import InlineError from '../messages/InlineError';

class RoomForm extends Component {

  state = {
    data: {
      name: "",
      owner_id: localStorage.spotifyId || "",
      location: "",
      type: 0
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
        .catch(err => { console.log(err) });//this.setState({ errors: err.response.data.errors, loading: false })});
    }
  };

  validate = (data) => {
    const errors = {};
    if (!data.name) errors.name = "Can't be blank.";
    if (!data.owner_id) errors.owner_id = "Can't be blank.";
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
        <Form.Field error={!!errors.name}>
          <label htmlFor="name">Room Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="cool room name"
            value={data.name}
            onChange={this.onChange}
          />
          {errors.name && <InlineError text={errors.name}/>}
        </Form.Field>
        <Form.Field error={errors.owner_id}>
          <label htmlFor="owner_id">Owner Spotify ID</label>
          <input
            type="text"
            id="owner_id"
            name="owner_id"
            placeholder="owner_id"
            value={data.owner_id}
            onChange={this.onChange}
          />
          {errors.owner_id && <InlineError text={errors.owner_id}/>}
        </Form.Field>
        <Button primary>Create Room</Button>
      </Form>
    )
  }
}

RoomForm.propTypes = {
  submit: PropTypes.func.isRequired
};

export default RoomForm;
