import React, { Component } from 'react'
import JoinRoomForm from '../forms/JoinRoomForm';
import { connect } from 'react-redux';
import api from '../../api';

class JoinRoomPage extends Component {

  submit = data =>
    api.room.joinRoom(data).then(playlist_id => {
      console.log(playlist_id);
      return this.props.history.push('/room/'+playlist_id)
    });


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
