import React from "react";
import PropTypes from "prop-types";
import { Form, Button, List } from "semantic-ui-react";
import InlineError from "../messages/InlineError";
import store from '../../store';
import api from "../../api";


class PlaylistForm extends React.Component {

  constructor(props) {
    super(props)
  };

  state = {
    playlist_id: this.props.playlist_id,
    owner_id: this.props.owner_id,
    loading: false,
    errors: {},
    options: [],
    songs: {}
  };

  componentWillReceiveProps(props) {
    this.setState({ playlist_id: props.playlist_id });
    this.setState({ owner_id: props.owner_id });
    this.fetchOptions();
  };

  fetchOptions = () => {
    this.setState({ loading: true });
    api.playlist.getPlaylist(this.state.owner_id, this.state.playlist_id)
      .then( res => {
        console.log("Result: ");
        console.log(res);
        return res.tracks.items;
      })
      .then( items => {
        const options = [];
        const songsHash = {};
        items.forEach( item => {
          songsHash[item.track.name + " by " + item.track.artists["0"].name] = item.track.uri;
          options.push(item.track.name + " by " + item.track.artists["0"].name);
        });
        this.setState({ loading: false, options, songs: songsHash });
      })
      .catch( err => {
        console.log("Error: ");
        console.log(err);
      })
  };


  addSong = (e, data) => {
    // add song to playlist
    // need:
    // user id of ROOM playlist owner
    // playlist id of ROOM
    const song_uri = this.state.songs[data.content];
    //api.playlist.addTracksToPlaylist()
  }


  validate = data => {
    const errors = {};
    return errors;
  };

  render() {
    const { errors, data, loading } = this.state;
    console.log(this.state.options);
    return (
      <Form>
        <List
          selection
          animated
          divided
          items = {this.state.options}
          onItemClick = {this.addSong}
        />
      </Form>
    )

  }

}

PlaylistForm.propTypes = {
  submit: PropTypes.func.isRequired,
  playlist_id: PropTypes.string.isRequired,
  owner_id: PropTypes.string.isRequired
};

export default PlaylistForm;
