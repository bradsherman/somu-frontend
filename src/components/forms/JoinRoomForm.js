import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Form, Button, Message } from 'semantic-ui-react';
import Validator from "validator";
import InlineError from '../messages/InlineError';
import store from '../../store';

class JoinRoomForm extends Component {

  state = {
    data: {
      room_id: 0,
      username: ""
    },
    loading: false,
    errors: {}
  };

  componentDidMount() {
    const s = store.getState();
    this.setState({ data: { ...this.state.data, username: s.user.username}})
  }

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
        .catch(err => {
          console.log(err);
          this.setState({ errors: err.response.data.errors, loading: false });
        });
    }
  };

  validate = (data) => {
    const errors = {};
    if (!data.room_id) errors.room_id = "Can't be blank.";
    return errors;
  }

  render() {
    const { data, errors, loading } = this.state;
    console.log(this.state);

    return (
      <Form onSubmit={this.onSubmit} loading={loading}>
        { errors.global &&
          <Message negative>
            <Message.Header>Something went wrong</Message.Header>
            <p>{errors.global}</p>
          </Message>
        }
        <Form.Field error={!!errors.room_id}>
          <label htmlFor="email">Room ID</label>
          <input
            type="number"
            id="room_id"
            name="room_id"
            placeholder="room id"
            value={data.room_id}
            onChange={this.onChange}
          />
          {errors.room_id && <InlineError text={errors.room_id}/>}
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
