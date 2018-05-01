import React from "react";
import PropTypes from "prop-types";
import { Segment, Form, Button, List } from "semantic-ui-react";
import InlineError from "../messages/InlineError";
import store from '../../store';
import api from "../../api";


class PlaylistForm extends React.Component {

  state = {
    playlist_id: this.props.playlist_id,
    owner_id: this.props.owner_id,
    options: this.props.options,
    tracks: this.props.tracks,
    room_playlist_id: this.props.room_playlist_id,
    room_owner_id: this.props.room_owner_id
  };

  addSong = (e, data) => {

    console.log("add song: ");
    console.log(data.content);
    const s = store.getState();
    var uri = this.state.tracks[data.content];
    console.log(this.state);

    api.playlist.addTracksToPlaylist(this.state.room_owner_id, this.state.room_playlist_id, uri)
      .then(res => {
        // this.props.history.push('/dashboard');
        // this.props.history.push('/room/'+this.state.room_playlist_id);
        window.location.reload();
      })
      .catch(err => {
        console.log(err);
      })

    //const song_uri = this.state.songs[data.content];
    //api.playlist.addTracksToPlaylist()
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
            onItemClick = {this.addSong}
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
  room_owner_id: PropTypes.string.isRequired
};

export default PlaylistForm;
