import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Button } from "semantic-ui-react";
import { logout } from "../actions/auth";

const HomePage = ({ isAuthenticated, logout }) => (
  <div>
    <h1>Welcome to Harmonize!</h1>
    {isAuthenticated ? <Button onClick={() => logout()}>Logout</Button> : <Link to="/login">Login</Link>}
  </div>
)

HomePage.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    isAuthenticated: !!state.user.token
  }
};

export default connect(mapStateToProps, { logout })(HomePage);
