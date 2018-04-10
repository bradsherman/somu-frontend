import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class HomePage extends Component {
  render() {
    return (
      <div>
        <h1>Welcome to Harmonize!</h1>
        <Link to="/login">Login</Link>
      </div>
    )
  }
}
