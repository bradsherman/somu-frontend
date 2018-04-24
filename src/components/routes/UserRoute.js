import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { spotifyUserLoggedIn } from '../../actions/auth';

class UserRoute extends React.Component {
  constructor(props) {
    super(props);
    this.parsed = {
      access_token: localStorage.spotifyAccessToken || '',
      refresh_token: localStorage.spotifyRefreshToken || '',
      spotify_id: localStorage.spotifyId || ''
    }
  }

  componentDidMount() {
    if (!this.parsed.access_token || !this.parsed.refresh_token || !this.parsed.spotify_id) {
      var x = queryString.parse(this.props.location.search);
      this.parsed = x;
    }
    if (this.parsed.access_token && this.parsed.refresh_token && this.parsed.spotify_id) {
      const { dispatch } = this.props;
      localStorage.spotifyAccessToken = this.parsed.access_token;
      localStorage.spotifyRefreshToken = this.parsed.refresh_token;
      localStorage.spotifyId = this.parsed.spotify_id;
      dispatch(spotifyUserLoggedIn(this.parsed));
    } else {
      window.location.assign("http://35.171.74.240:3000/spotify/auth/login");
    }
  }

  render() {
    const { isAuthenticated, spotifyAuth, component: Component, ...rest } = this.props;
    return (
      <Route {...rest} render={props =>
        isAuthenticated && spotifyAuth
        ?
          <Component {...props} />
        :
          <Redirect to="/" />
        }
      />
    );
  }

}

UserRoute.propTypes = {
  component: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  spotifyAuth: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    isAuthenticated: !!state.user.token,
    spotifyAuth: !!state.user.access_token && !!state.user.refresh_token && !!state.user.spotify_id
  }
}

export default connect(mapStateToProps)(UserRoute);
