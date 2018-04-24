import React, { Component } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { spotifyUserLoggedIn } from '../../actions/auth';

class RoomPage extends Component {

  render() {
    return (
      <div>
        <h1>Room Page</h1>
      </div>
    )
  }

};

export default connect(state => state)(RoomPage);
