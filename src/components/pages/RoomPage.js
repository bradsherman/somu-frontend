import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

class RoomPage extends Component {

  render() {
    return (
      <div>
        <h1>Room Page</h1>
        <Link to="/room/new"><Button>New Room</Button></Link>
      </div>
    )
  }

};

export default connect(state => state)(RoomPage);
