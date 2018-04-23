import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Button } from "semantic-ui-react";
import { logout } from "../../actions/auth";

const HomePage = ({ isAuthenticated, spotifyAuth, logout }) => (
  <div style={{textAlign: 'center'}}>
    <h1>Welcome to Harmonize</h1>
    {isAuthenticated ?
      <div>
        <Link to="/dashboard"><Button className="green">Dashboard</Button></Link>
        <Button onClick={() => logout()}>Logout</Button>
      </div>
      : <div>
          <Link to="/login"><Button primary>Login</Button></Link> or <Link to="/signup"><Button>Signup</Button></Link>
        </div>
    }
  </div>
)

HomePage.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    isAuthenticated: !!state.user.token,
    spotifyAuth: !!state.user.access_token && !!state.user.refresh_token
  }
};

export default connect(mapStateToProps, { logout })(HomePage);
