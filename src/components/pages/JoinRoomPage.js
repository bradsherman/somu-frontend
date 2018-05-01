import React, { Component } from 'react'
import JoinRoomForm from '../forms/JoinRoomForm';
import { connect } from 'react-redux';
import api from '../../api';

class JoinRoomPage extends Component {

  submit = data =>
    api.room.joinRoom(data).then(() => this.props.history.push('/dashboard'));


  render() {
    return (
      <div>
        <h1>Join Room Page</h1>
        <JoinRoomForm submit={this.submit} />
      </div>
    )
  }
}


export default connect(null)(JoinRoomPage);
