import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Icon, Segment, Image, List, Grid, Divider, Container } from 'semantic-ui-react';
import SpotifyPlayer from 'react-spotify-player';
import PropTypes from "prop-types";
// import openSocket from "socket.io-client";
import io from "socket.io-client";
import SearchSongForm from '../forms/SearchSongForm';
import SearchPlaylistForm from '../forms/SearchPlaylistForm';
import PlaylistForm from '../forms/PlaylistForm';
import api from '../../api';
import store from '../../store';

class RoomPage extends React.Component {

  constructor(props) {
    super(props);
    this.playerCheckInterval = null;
    this.socket = io.connect(api.api_url);
    this.sendSongRequest = this.sendSongRequest.bind(this);
    this.subscribeToSongRequest = this.subscribeToSongRequest.bind(this);
    this.handleSongRequest = this.handleSongRequest.bind(this);
    this.getPlaylistTracks = this.getPlaylistTracks.bind(this);
    this.removeTrack = this.removeTrack.bind(this);

    this.socket.on('message', m => console.log(m));
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
    snapshot_id: "",
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
    currentUri: "",
    playing: false,
    position: 0,
    duration: 0,
    connected: false
  };

  componentWillMount() {
    this.setState({ room_playlist_id: this.props.match.params.playlist_id });
    this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
  }

  removeTrack(e, data) {
    if (data.pos) {
      api.playlist.removeTrack(this.state.room_owner_id, this.state.room_playlist_id, data.pos, this.state.snapshot_id)
        .then(res => {
          this.getPlaylistTracks();
        })
        .catch(err => {
          console.log(err);
        })
    }
  }

  getPlaylistTracks() {
    api.playlist.getPlaylist(this.state.room_owner_id, this.state.room_playlist_id)
      .then(res => {
        let tracks = [];
        tracks = res.tracks.items.map((t, i) =>{
          let artists = t.track.artists.map(a => a.name).join(", ");
          return (
          <List.Item key={t.track.id+i}>
            <Image src={t.track.album.images[2].url} inline circular size='mini'/>
            <List.Content>
              <List.Header>
                {t.track.name}
              </List.Header>
              <List.Description>
                {artists}
              </List.Description>
            </List.Content>
            {this.state.isOwner &&
            <List.Content floated='right'>
              <Button onClick={this.removeTrack} uri={t.track.uri} pos={i} size='mini' basic color='red'>Remove</Button>
            </List.Content>
            }
          </List.Item>
          )
        })
        this.setState({ room_tracks: tracks, snapshot_id: res.snapshot_id });
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
        this.getPlaylistTracks();
        if (this.state.isOwner) this.subscribeToSongRequest();
      });


  }

  onSongSelect = song => {
    this.setState({ song });
    const s = store.getState();
    console.log('IN SONG SELECT');
    // add song to playlist API call
    api.playlist.addTracksToPlaylist(this.state.room_owner_id, this.state.room_playlist_id, song.uri)
      .then(res => {
        this.getPlaylistTracks();
        // can't do this yet, have to seek with playlist owner's account
        // if (this.state.connected) this.updatePlayer();
      })
      .catch(err => {
        console.log(err);
      })
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

  createEventHandlers() {
    this.player.on('initialization_error', e => { console.error('INITIALIZATION ERROR'); console.error(e); });
    this.player.on('authentication_error', e => { console.error('AUTHENTICATION ERROR'); console.error(e); });
    this.player.on('account_error', e => { console.error('ACCOUNT ERROR'); console.error(e); });
    this.player.on('playback_error', e => { console.error('PLAYBACK ERROR'); console.error(e); });

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
        position,
        duration
      } = state;
      const { current_track: currentTrack } = state.track_window;
      const trackName = currentTrack.name;
      const artistName = currentTrack.artists
        .map(artist => artist.name)
        .join(", ");
      const albumName = currentTrack.album.name;
      const currentUri = currentTrack.uri;
      const playing = !state.paused;
      console.log(position, duration);
      this.setState({
        position,
        duration,
        trackName,
        albumName,
        artistName,
        currentUri,
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

  // have to figure out user permissions for this
  updatePlayer() {
    const { deviceId, playlist_uri, position, currentUri } = this.state;
    console.log('IN UPDATE PLAYER');
    api.user.playSongOnPlaylist(deviceId, playlist_uri, currentUri)
      .then(res => {
          console.log("OFFSET");
          console.log(res);
        api.user.seek(position)
          .then(r => {
            console.log("DONE SEEKING");
            console.log(r);
          })
          .catch(err => {
            console.log(err);
          })
      })
      .catch(err => {
        console.log(err);
      })
  }

  connectToPlaylist() {
    if (this.state.deviceId) {
      api.user.play(this.state.deviceId, this.state.playlist_uri)
        .then(res => {
          console.log(res);
          this.setState({ connected: true });
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

    return (
      <div>
        <Container textAlign='center'>
          <h1>{this.state.name}</h1>
          <p>by {this.state.room_owner_id}</p>
          <h4>Room ID: {this.state.room_id} (Use this to invite members to your room!)</h4>
        </Container>

        <Divider></Divider>

        <Grid columns='equal'>
          <Grid.Row textAlign='center'>
            <Grid.Column>
              {
                (() => {
                  if (this.state.deviceId && !this.state.connected) {
                    return <Button primary onClick={() => this.connectToPlaylist()}>Start listening!</Button>
                  } else if (this.state.deviceId && this.state.connected) {
                    return (
                      <div>
                      <h3>Now Playing</h3>
                      <p>{this.state.trackName} by {this.state.artistName}</p>
                      <p>{this.state.albumName}</p>
                      <p>
                        <Button size='tiny' icon onClick={() => this.onPrevClick()}><Icon name="left arrow"/></Button>
                        <Button size='tiny' icon onClick={() => this.onPlayClick()}>{this.state.playing ? <Icon name="pause"/> : <Icon name="play"/>}</Button>
                        <Button size='tiny' icon onClick={() => this.onNextClick()}><Icon name="right arrow"/></Button>
                      </p>
                      </div>
                    )
                  } else {
                      return (
                        <div>
                          <p>Waiting for player to connect...</p>
                        </div>
                      )
                  }
                })()
              }
            </Grid.Column>
            <Grid.Column>
              <p>Rating system coming soon...</p>
            </Grid.Column>
          </Grid.Row>
        </Grid>


        <Divider></Divider>

        <Grid columns='equal'>
          <Grid.Row>
              <Grid.Column>
                <h3>Add New Song to Your Room</h3>
                <SearchSongForm onSongSelect={this.state.isOwner ? this.onSongSelect : this.sendSongRequest} />
              </Grid.Column>
              <Grid.Column>
                <h3> Search Your Playlists </h3>
                <SearchPlaylistForm onPlaylistSelect={this.onPlaylistSelect} />
                {!this.state.loading && this.state.options.length > 0 && (
                  <PlaylistForm
                    playlist_id={this.state.playlist_id}
                    owner_id={this.state.owner_id}
                    options={this.state.options}
                    tracks={this.state.tracks}
                    room_playlist_id={this.state.room_playlist_id}
                    room_owner_id={this.state.room_owner_id}
                    isOwner={this.state.isOwner}
                    sendSongRequest={this.sendSongRequest}
                    getTracks={this.getPlaylistTracks}
                    onSongSelect={this.onSongSelect}
                  />
                )}
              </Grid.Column>
          </Grid.Row>
        </Grid>

        <Divider></Divider>

        <Grid columns='equal'>
          <Grid.Row>
              <Grid.Column>
                <h3>Tracks</h3>
                <List
                  animated
                  selection
                  items={this.state.room_tracks}
                />
              </Grid.Column>
              <Grid.Column textAlign='center'>
                <h3> Room Members </h3>
                {this.state.members.map(m => {
                  return (<p key={m.USER_ID}>{m.FIRST_NAME} {m.LAST_NAME} ({m.USERNAME})</p>)
                })}
              </Grid.Column>
          </Grid.Row>
        </Grid>

      </div>

    )
  };

};

export default connect(state => state) (RoomPage);
