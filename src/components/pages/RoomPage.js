import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Icon, Segment, Image, Progress, List } from 'semantic-ui-react';
import SpotifyPlayer from 'react-spotify-player';
import PropTypes from "prop-types";
import openSocket from "socket.io-client";
import SearchSongForm from '../forms/SearchSongForm';
import SearchPlaylistForm from '../forms/SearchPlaylistForm';
import PlaylistForm from '../forms/PlaylistForm';
import api from '../../api';
import store from '../../store';

class RoomPage extends React.Component {

  constructor(props) {
    super(props);
    this.playerCheckInterval = null;
    this.socket = openSocket(api.socket_url);
    this.sendSongRequest = this.sendSongRequest.bind(this);
    this.subscribeToSongRequest = this.subscribeToSongRequest.bind(this);
    this.handleSongRequest = this.handleSongRequest.bind(this);
    this.getPlaylistTracks = this.getPlaylistTracks.bind(this);
  };

  state = {
    song: null,
    name: "",
    owner_id: "",
    room_owner_id: "",
    isOwner: false,
    room_id: "",
    room_playlist_id: "",
    room_tracks: [],
    playlist_id: "",
    members: [],
    playlist_uri: "",
    options: [],
    loading: false,
    tracks: {},
    spotify_player: null,
    deviceId: "",
    trackName: "Track Name",
    artistName: "Artist Name",
    albumName: "Album Name",
    playing: false,
    position: 0,
    duration: 0
  };

  componentWillMount() {
    this.setState({ room_playlist_id: this.props.match.params.playlist_id });
    this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
  }

  getPlaylistTracks() {
    api.playlist.getPlaylistTracks(this.state.room_owner_id, this.state.room_playlist_id)
      .then(res => {
        this.setState({ room_tracks: res.items.map(i => i.track)});
        // if (this.state.isOwner) this.subscribeToSongRequest();
        // this.subscribeToSongRequest();
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentDidMount() {
    const s = store.getState();
    api.room.getRoom(this.state.room_playlist_id)
      .then(res => {
        this.setState({
          name: res.data.info.NAME,
          room_owner_id: res.data.info.OWNER_ID,
          room_id: res.data.info.ROOM_ID,
          isOwner: res.data.info.OWNER_ID === s.user.spotify_id,
          members: res.data.members,
          playlist_uri: "spotify:user:"+res.data.info.OWNER_ID+":playlist:"+res.data.info.PLAYLIST_ID
        });
        return;
      })
      .then(() => {
        // api.playlist.getPlaylistTracks(this.state.room_owner_id, this.state.room_playlist_id)
        //   .then(res => {
        //     this.setState({ room_tracks: res.items.map(i => i.track)});
        this.getPlaylistTracks();
        if (this.state.isOwner) this.subscribeToSongRequest();
        // this.subscribeToSongRequest();
          // })
          // .catch(err => {
          //   console.log(err);
          // });
      });


  }

  onSongSelect = song => {
    this.setState({ song });
    const s = store.getState();
    // add song to playlist API call
    api.playlist.addTracksToPlaylist(this.state.room_owner_id, this.state.room_playlist_id, song.uri)
      .then(res => {
        // window.location.reload();
        this.getPlaylistTracks();
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
  createEventHandlers() {
    this.player.on('initialization_error', e => { console.error(e); });
    this.player.on('authentication_error', e => { console.error(e); });
    this.player.on('account_error', e => { console.error(e); });
    this.player.on('playback_error', e => { console.error(e); });

    // Playback status updates
    this.player.on('player_state_changed', state => { this.onStateChanged(state); });

    // Ready
    this.player.on('ready', data => {
      let { device_id } = data;
      console.log("Let the music play on!");
      this.setState({ deviceId: device_id });
    });
  }


  checkForPlayer() {
    const s = store.getState();
    const token = s.user.access_token;
    if (window.Spotify !== null) {
      clearInterval(this.playerCheckInterval);
      this.player = new window.Spotify.Player({
        name: "Harmonize Playback SDK",
        getOAuthToken: cb => { cb(token); },
      });
      this.createEventHandlers();
      this.player.connect();
    }
  }

  onStateChanged(state) {
    if (state !== null) {
      const {
        current_track: currentTrack,
        position,
        duration
      } = state.track_window;
      const trackName = currentTrack.name;
      const artistName = currentTrack.artists
        .map(artist => artist.name)
        .join(", ");
      const albumName = currentTrack.album.name;
      const playing = !state.paused;
      this.setState({
        position,
        duration,
        trackName,
        albumName,
        artistName,
        playing
      });
    }
  }

  onPrevClick() {
    this.player.previousTrack();
  }

  onPlayClick() {
    this.player.togglePlay();
  }

  onNextClick() {
    this.player.nextTrack();
  }

  connectToPlaylist() {
    if (this.state.deviceId) {
      api.user.play(this.state.deviceId, this.state.playlist_uri)
        .then(res => {
          console.log(res);
          return;
        })
        .catch(err => {
          console.log(err);
          return;
        });
    }
  }

  subscribeToSongRequest() {
    console.log('SUBSCRIBED');
    this.socket.on('song_requested', request => {
      console.log('GOT A SONG REQUEST');
      console.log(request);
      this.handleSongRequest(request);
    });
  }

  handleSongRequest(request) {
    this.onSongSelect(request.song);
  }

  sendSongRequest(song) {
    // add user data here so we know who requested it
    console.log('REQUESTED A SONG');
    console.log(song);
    const s = store.getState();
    const name = s.user.first_name + " " + s.user.last_name;
    const username = s.user.username;
    this.socket.emit('song_request', { name, username, song });
    this.getPlaylistTracks();
  }

  render() {

    // size may also be a plain string using the presets 'large' or 'compact'
    const size = {
      width: '100%',
      height: 300,
    };
    const view = 'list'; // or 'coverart'
    const theme = 'black'; // or 'white'
        // {this.state.room_owner_id && this.state.playlist_uri && <SpotifyPlayer
        //   uri={this.state.playlist_uri}
        //   size={size}
        //   view={view}
        //   theme={theme}
        // />}
            // <Link to="/"><Button primary>Home</Button></Link>

            // <Progress data-percent={this.state.position/this.state.duration}/>

    return (
      <div>
        <h1>{this.state.name}</h1>
        <p>by {this.state.room_owner_id}</p>
        <h4>Room ID: {this.state.room_id} (Use this to invite members to your room!)</h4>
        <Button primary onClick={() => this.connectToPlaylist()}>Start listening!</Button>

        <Segment>
        <h3>Now Playing</h3>
        {this.state.deviceId ?
          (
            <div>
            <p>Artist: {this.state.artistName}</p>
            <p>Track: {this.state.trackName}</p>
            <p>Album: {this.state.albumName}</p>
            <p>
              <Button icon onClick={() => this.onPrevClick()}><Icon name="left arrow"/></Button>
              <Button icon onClick={() => this.onPlayClick()}>{this.state.playing ? <Icon name="pause"/> : <Icon name="play"/>}</Button>
              <Button icon onClick={() => this.onNextClick()}><Icon name="right arrow"/></Button>
            </p>
           </div>
          )
          :
          (<div>
            <p>Waiting for player to connect...</p>
           </div>)
        }
        </Segment>

        <Segment.Group horizontal>
        <Segment>
        <h4>Tracks</h4>
        <Segment.Group>
        {
          this.state.room_tracks.map(t =>{
            return (
            <div key={t.id}>
            <Segment>
              <div>
                <Image inline circular src={t.album.images[2].url} /><p>{t.name}</p>
              </div>
            </Segment>
            </div>
            )
          })
        }
        </Segment.Group>
        </Segment>

        <Segment>
          <h3> Room Members </h3>
          {this.state.members.map(m => {
            return (<p key={m.USER_ID}>{m.FIRST_NAME} {m.LAST_NAME} ({m.USERNAME})</p>)
          })}
        </Segment>
        </Segment.Group>


        <Segment.Group horizontal>
        <Segment>
          <h3>Add New Song to Your Room</h3>
          <SearchSongForm onSongSelect={this.state.isOwner ? this.onSongSelect : this.sendSongRequest} />
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
              room_playlist_id={this.state.room_playlist_id}
              room_owner_id={this.state.room_owner_id}
              isOwner={this.state.isOwner}
              sendSongRequest={this.sendSongRequest}
            />
          )}
        </Segment>
        </Segment.Group>

      </div>

    )
  };

};

export default connect(state => state) (RoomPage);
