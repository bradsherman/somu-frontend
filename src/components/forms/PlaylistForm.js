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
    tracks: this.props.tracks
  };

  addSong = (e, data) => {
    // add song to playlist
    // need:
    // user id of ROOM playlist owner
    // playlist id of ROOM
    console.log("add song: ");
    console.log(data.content);
    console.log(this.state.tracks[data.content]);
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
};

export default PlaylistForm;
