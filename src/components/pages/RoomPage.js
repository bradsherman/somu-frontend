import React, { Component } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { spotifyUserLoggedIn } from '../../actions/auth';

class RoomPage extends Component {

  constructor(props) {
    super(props);
    // this.parsed = {
    //   access_token: localStorage.spotifyAccessToken || '',
    //   refresh_token: localStorage.spotifyRefreshToken || ''
    // }
  }
  componentWillMount() {
    // grab access/refresh token and dispatch to redux
    // var x = queryString.parse(this.props.location.search);
    // this.parsed = x;
    // if (this.parsed.access_token && this.parsed.refresh_token) {
    //   const { dispatch } = this.props;
    //   localStorage.spotifyAccessToken = this.parsed.access_token;
    //   localStorage.spotifyRefreshToken = this.parsed.refresh_token;
    //   dispatch(spotifyUserLoggedIn(x));
    // }
  }

  render() {
    console.log(this.props);
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
