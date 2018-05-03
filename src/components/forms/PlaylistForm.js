import React from "react";
import PropTypes from "prop-types";
import { Segment, Form, Button, List } from "semantic-ui-react";
import InlineError from "../messages/InlineError";
import store from '../../store';
import api from "../../api";
import { timingSafeEqual } from "crypto";


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
    sendSongRequest: this.props.sendSongRequest,
    getTracks: this.props.getTracks,
    onSongSelect: this.props.onSongSelect
  };

  addSong = (e, data) => {

    console.log("add song: ");
    console.log(data.content);
    const s = store.getState();
    var uri = this.state.tracks[data.content];
    console.log(this.state);

    api.songs.getSong(uri)
      .then(res => {
        console.log(res);
        this.state.onSongSelect(res);
      });

    // api.playlist.addTracksToPlaylist(this.state.room_owner_id, this.state.room_playlist_id, uri)
    //   .then(res => {
    //     this.state.getTracks();
    //     this.setState({ options: null });
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   })
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
      <div>
        {this.state.options &&
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
        }
      </div>
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
  sendSongRequest: PropTypes.func.isRequired,
  getTracks: PropTypes.func.isRequired,
  onSongSelect: PropTypes.func.isRequired
};

export default PlaylistForm;
