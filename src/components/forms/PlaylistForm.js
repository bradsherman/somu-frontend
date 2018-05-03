import React from "react";
import PropTypes from "prop-types";
import { Segment, Form, Button, List } from "semantic-ui-react";
import InlineError from "../messages/InlineError";
import store from '../../store';
import api from "../../api";


class PlaylistForm extends React.Component {

  constructor(props) {
    super(props);

    this.sendSongRequestFromPlaylist = this.sendSongRequestFromPlaylist.bind(this);
  }

  state = {
    playlist_id: this.props.playlist_id,
    owner_id: this.props.owner_id,
    options: this.props.options,
    tracks: this.props.tracks,
    room_playlist_id: this.props.room_playlist_id,
    room_owner_id: this.props.room_owner_id,
    isOwner: this.props.isOwner,
    sendSongRequest: this.props.sendSongRequest
  };

  addSong = (e, data) => {

    console.log("add song: ");
    console.log(data.content);
    const s = store.getState();
    var uri = this.state.tracks[data.content];
    console.log(this.state);

    api.playlist.addTracksToPlaylist(this.state.room_owner_id, this.state.room_playlist_id, uri)
      .then(res => {
        window.location.reload();
      })
      .catch(err => {
        console.log(err);
      })
  }

  sendSongRequestFromPlaylist(e, data) {
    const id = this.state.tracks[data.content].split(":")[2];
    api.songs.getSong(id)
      .then(s => {
        this.state.sendSongRequest(s);
      });
  }

  render() {

    return (
      <Segment>
        <Form>
          <List
            selection
            animated
            divided
            items = {this.state.options}
            onItemClick = {this.state.isOwner ? this.addSong : this.sendSongRequestFromPlaylist}
          />
        </Form>
      </Segment>
    )

  }

}

PlaylistForm.propTypes = {
  playlist_id: PropTypes.string.isRequired,
  owner_id: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  room_playlist_id: PropTypes.string.isRequired,
  room_owner_id: PropTypes.string.isRequired,
  isOwner: PropTypes.bool.isRequired,
  sendSongRequest: PropTypes.func.isRequired
};

export default PlaylistForm;
