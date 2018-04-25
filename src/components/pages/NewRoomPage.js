import React, { Component } from "react";
import PropTypes from 'prop-types';
import RoomForm from "../forms/RoomForm";
import api from "../../api";

class NewRoomPage extends Component {

  submit = data =>
    api.playlist.createPlaylist(data)
      .then((res) => {
        console.log('after creating playlist');
        return api.room.createRoom(data, res.id)
          .then(res => {
            // this.props.history.push("/dashboard")
            console.log('In new room');
            console.log(res);
            return this.props.history.push("/dashboard");
          })
          .catch(err => {
            console.log(err);
            return this.props.history.push("/dashboard");
          });
      });


  render() {
    return (
      <div>
        <h1>Start a room</h1>
        <RoomForm submit={this.submit}/>
      </div>
    );
  }
}

NewRoomPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  })
}

export default NewRoomPage;
