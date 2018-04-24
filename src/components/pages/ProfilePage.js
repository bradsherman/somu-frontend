import React, { Component } from 'react';
import { Button, Image } from 'semantic-ui-react';
import api from '../../api';
import store from '../../store';


class ProfilePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      displayName: '',
      username: '',
      img: '',
    }
  }


  updateInfo() {
    const s = store.getState();
    api.user.getCurrentProfile(s.user.spotify_id).then(res => {
        this.setState({ displayName: res.display_name, username: res.id, img: res.images[0].url });
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentDidMount() {
    this.updateInfo();
  }

  render() {
    return (
      <div>
        <h1>My Profile</h1>
        <h4>Username: </h4><p>{this.state.username}</p>
        <h4>Display Name: </h4><p>{this.state.displayName}</p>
      </div>
    );
  }
}

export default ProfilePage;
