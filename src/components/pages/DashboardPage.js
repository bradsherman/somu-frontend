import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from "semantic-ui-react";
import SpotifyPlayer from 'react-spotify-player';

class DashboardPage extends Component {
  render() {
    // size may also be a plain string using the presets 'large' or 'compact'
    const size = {
      width: '100%',
      height: 300,
    };
    const view = 'list'; // or 'coverart'
    const theme = 'black'; // or 'white'
    return (
      <div>
        <h1>Dashboard Page</h1>
          <div>
            <Link to="/"><Button primary>Home</Button></Link>
            <Link to="/room"><Button className="green">Rooms</Button></Link>
          </div>
          <SpotifyPlayer
            uri="spotify:user:spotify:playlist:37i9dQZF1DXcBWIGoYBM5M"
            size={size}
            view={view}
            theme={theme}
          />

      </div>
    )
  };
};

export default connect(null)(DashboardPage);