import React, { Component } from 'react';
import api from '../../api';

class ProfilePage extends Component {
  state = {
    username: 'hello',
  }

  componentWillMount() {
    this.setState({ username: 'bsherman' });
  }

  render() {
    return (
      <div>
        {this.state.username}
      </div>
    );
  }
}

export default ProfilePage;
