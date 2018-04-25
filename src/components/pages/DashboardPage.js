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
          // <SpotifyPlayer
          //   uri="spotify:user:spotify:playlist:37i9dQZF1DXcBWIGoYBM5M"
          //   size={size}
          //   view={view}
          //   theme={theme}
          // />
            // <Link to="/"><Button primary>Home</Button></Link>
    return (
      <div>
        <h1>Dashboard Page</h1>
          <div>
            <Link to="/room/new"><Button className="green">Create a Room</Button></Link>
          </div>

      </div>
    )
  };
};

export default connect(null)(DashboardPage);
