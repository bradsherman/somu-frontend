import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import SpotifyPlayer from 'react-spotify-player';
import { Segment } from 'semantic-ui-react';
import PropTypes from "prop-types";
import SearchSongForm from '../forms/SearchSongForm';
import SearchPlaylistForm from '../forms/SearchPlaylistForm';
import PlaylistForm from '../forms/PlaylistForm';
import api from '../../api';

class RoomPage extends React.Component {

  constructor(props) {
    super(props);
  };

  state = {
    song: null,
    name: "",
    owner_id: "",
    room_playlist_id: "",
    playlist_id: "",
    members: [],
    playlist_uri: ""
  };

  componentWillMount() {
    this.setState({ room_playlist_id: this.props.match.params.playlist_id });
  }

  componentDidMount() {
    console.log("STATE");
    console.log(this.state);
    api.room.getRoom(this.state.room_playlist_id)
      .then(res => {
        // console.log(res);
        this.setState({
          name: res.data.info.NAME,
          owner_id: res.data.info.OWNER_ID,
          members: res.data.members,
          playlist_uri: "spotify:user:"+res.data.info.OWNER_ID+":playlist:"+res.data.info.PLAYLIST_ID
        })
      });
  }

  onSongSelect = song => {
    this.setState({ song });
    // add song to playlist API call
  };

  onPlaylistSelect = playlist => {
    this.setState({ playlist_id: playlist.id });
    this.setState({ owner_id: playlist.owner.id });
    // add playlist songs view
  };

  getPlaylist = () => {
    console.log("get playlist");
  };

  render() {

    // size may also be a plain string using the presets 'large' or 'compact'
    const size = {
      width: '100%',
      height: 300,
    };
    const view = 'list'; // or 'coverart'
    const theme = 'black'; // or 'white'
            // <Link to="/"><Button primary>Home</Button></Link>

    return (
      <div>
        <h1>{this.state.name}</h1>

        <Link to="/new_room"><Button>New Room</Button></Link>

        <Segment>
          <h3> Room Members </h3>
          {this.state.members.map(m => {
            console.log(m);
            return (<p key={m.USER_ID}>{m.FIRST_NAME} {m.LAST_NAME} ({m.USERNAME})</p>)
          })}
        </Segment>

        {this.state.owner_id && this.state.playlist_uri && <SpotifyPlayer
          uri={this.state.playlist_uri}
          size={size}
          view={view}
          theme={theme}
        />}

        <Segment>
          <h3>Add New Song to Your Room</h3>
          <SearchSongForm onSongSelect={this.onSongSelect} />
        </Segment>

        <Segment>
          <h3> Search Your Playlists </h3>
          <SearchPlaylistForm onPlaylistSelect={this.onPlaylistSelect} />
          {this.state.playlist_id && (
            <PlaylistForm submit={this.getPlaylist} playlist_id={this.state.playlist_id} owner_id={this.state.owner_id} />
          )}
        </Segment>

      </div>

    )
  };

};

export default connect(state => state) (RoomPage);
