import React, { Component } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { spotifyUserLoggedIn } from '../../actions/auth';

class RoomPage extends Component {

  render() {
    return (
      <div>
        <h1>Room Page</h1>
        <p>Access Token: {this.props.access_token}</p>
        <p>Refresh Token: {this.props.refresh_token}</p>
      </div>
    )
  }

};

export default connect(state => state)(RoomPage);
