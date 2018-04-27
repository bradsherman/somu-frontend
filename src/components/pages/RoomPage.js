import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { Segment } from 'semantic-ui-react';
import SearchSongForm from '../forms/SearchSongForm';

class RoomPage extends Component {

  state = {
    song: null
  }

  onSongSelect = song => {
    this.setState({ song });
    console.log('hi');
    // add song to playlist API call
  }


  render() {
    return (
      <div>
        <h1>Room Page</h1>

        <Link to="/room/new"><Button>New Room</Button></Link>

        <Segment>
          <h3>Add New Song to Your Room</h3>
          <SearchSongForm onSongSelect={this.onSongSelect} />
        </Segment>

      </div>

    )
  }

};

export default connect(state => state)(RoomPage);
