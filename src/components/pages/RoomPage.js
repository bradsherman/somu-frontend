import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import SpotifyPlayer from 'react-spotify-player';
import { Segment } from 'semantic-ui-react';
import SearchSongForm from '../forms/SearchSongForm';
import SearchPlaylistForm from '../forms/SearchPlaylistForm';

class RoomPage extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    song: null,
    playlist: null
  }

  onSongSelect = song => {
    this.setState({ song });
    console.log('song selected');
    // add song to playlist API call
  }

  onPlaylistSelect = playlist => {
    this.setState({ playlist });
    console.log('playlist selected');
    // add playlist songs view
  }

  render() {
    // size may also be a plain string using the presets 'large' or 'compact'
    const size = {
      width: '100%',
      height: 300,
    };
    const view = 'list'; // or 'coverart'
    const theme = 'black'; // or 'white'
            // <Link to="/"><Button primary>Home</Button></Link>
    console.log(this.props);
    return (
      <div>
        <h1>Room Page</h1>
        <SpotifyPlayer
          uri="spotify:user:spotify:playlist:37i9dQZF1DXcBWIGoYBM5M"
          size={size}
          view={view}
          theme={theme}
        />

        <Link to="/room/new"><Button>New Room</Button></Link>

        <Segment>
          <h3>Add New Song to Your Room</h3>
          <SearchSongForm onSongSelect={this.onSongSelect} />
        </Segment>

        <Segment>
          <h3> Search Your Playlists </h3>
          <SearchPlaylistForm onPlaylistSelect={this.onPlaylistSelect} />
        </Segment>

      </div>

    )
  }

};

export default connect(state => state)(RoomPage);
