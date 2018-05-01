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
import store from '../../store';

class RoomPage extends React.Component {

  constructor(props) {
    super(props);
  };

  state = {
    song: null,
    name: "",
    owner_id: "",
    room_id: "",
    room_playlist_id: "",
    playlist_id: "",
    members: [],
    playlist_uri: "",
    options: [],
    loading: false,
    tracks: {}
  };

  componentWillMount() {
    this.setState({ room_playlist_id: this.props.match.params.playlist_id });
  }

  componentDidMount() {
    api.room.getRoom(this.state.room_playlist_id)
      .then(res => {
        this.setState({
          name: res.data.info.NAME,
          owner_id: res.data.info.OWNER_ID,
          room_id: res.data.info.ROOM_ID,
          members: res.data.members,
          playlist_uri: "spotify:user:"+res.data.info.OWNER_ID+":playlist:"+res.data.info.PLAYLIST_ID
        })
      });
  }

  onSongSelect = song => {
    this.setState({ song });
    const s = store.getState();
    // add song to playlist API call
    api.playlist.addTracksToPlaylist(s.user.spotify_id, this.state.room_playlist_id, song.uri)
      .then(res => {
        // this.props.history.push('/dashboard');
        // this.props.history.push('/room/'+this.state.room_playlist_id);
        window.location.reload();
      })
      .catch(err => {
        console.log(err);
      })
    // song.uri
  };

  onPlaylistSelect = playlist => {

    this.setState({loading: true});
    this.setState({ playlist_id: playlist.id });
    this.setState({ owner_id: playlist.owner.id });

    api.playlist.getPlaylist(playlist.owner.id, playlist.id )
      .then( res => {
        return res.tracks.items;
      })
      .then( items => {
        const songsHash = {};
        const options1 = [];
        items.forEach( item => {
          songsHash[item.track.name + " by " + item.track.artists["0"].name] = item.track.uri;
          options1.push(item.track.name + " by " + item.track.artists["0"].name);
        });
        this.setState({ options: options1 });
        this.setState({ tracks: songsHash });
        this.setState({loading: false});
      })
      .catch( err => {
        console.log("Error: ");
        console.log(err);
      })

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
        <p>by {this.state.owner_id}</p>
        <h4>Room ID: {this.state.room_id} (Use this to invite members to your room!)</h4>

        <Segment>
          <h3> Room Members </h3>
          {this.state.members.map(m => {
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
          {!this.state.loading && (
            <PlaylistForm
              playlist_id={this.state.playlist_id}
              owner_id={this.state.owner_id}
              options={this.state.options}
              tracks={this.state.tracks}
            />
          )}
        </Segment>

      </div>

    )
  };

};

export default connect(state => state) (RoomPage);
