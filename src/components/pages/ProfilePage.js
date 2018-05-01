import React, { Component } from 'react';
import { Button, Image, Segment, Grid, Icon } from 'semantic-ui-react';
import api from '../../api';
import store from '../../store';


class ProfilePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      displayName: '',
      spotify_username: '',
      img: '',
      followers: ''
    }
  }


  updateInfo() {
    const s = store.getState();
    api.user.getCurrentProfile(s.user.spotify_id).then(res => {
        console.log(res);
        this.setState({
          displayName: res.display_name,
          spotify_username: res.id,
          img: res.images[0].url,
          followers: res.followers.total
        });
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
      <Segment>
        <Grid columns={2} stacktable>
          <Grid.Row >

            <Grid.Column>
              <Image size="medium" src={this.state.img} />
            </Grid.Column>

            <Grid.Column >
              <h1>My Profile</h1>
              <h4>Spotify Username: </h4><p>{this.state.spotify_username}</p>
              <h4>Spotify Display Name: </h4><p>{this.state.displayName}</p>
              <h4>Followers: </h4><p>{this.state.followers}</p>
            </Grid.Column>

          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

export default ProfilePage;
