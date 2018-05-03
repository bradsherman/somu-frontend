import React, { Component } from 'react';
import { Button, Image, Segment, Grid, Icon, List, Divider } from 'semantic-ui-react';
import api from '../../api';
import store from '../../store';


class ProfilePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      displayName: '',
      spotify_username: '',
      img: '',
      followers: '',
      top_tracks: [],
      top_artists: []
    }
  }


  updateInfo() {
    const s = store.getState();
    api.user.getCurrentProfile(s.user.spotify_id).then(res => {
      this.setState({
        displayName: res.display_name,
        spotify_username: res.id,
        img: res.images[0].url,
        followers: res.followers.total
      });
    })
    .then(() => {
      api.user.getTopTracks()
        .then(res => {
          const tracks = res.items.map(t => {
            return t.name + " by " + t.artists.map(a => a.name).join(", ");
          })
          this.setState({ top_tracks: tracks });
        })
        .then(() => {
          api.user.getTopArtists()
            .then(res => {
              console.log(res);
              const artists = res.items.map(a => a.name)
              this.setState({ top_artists: artists })
            })
        })
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
              <Image circular size="medium" src={this.state.img} />
            </Grid.Column>

            <Grid.Column >
              <h1>My Profile</h1>
              <h4>Spotify Username: </h4><p>{this.state.spotify_username}</p>
              <h4>Spotify Display Name: </h4><p>{this.state.displayName}</p>
              <h4>Followers: </h4><p>{this.state.followers}</p>
            </Grid.Column>

          </Grid.Row>
          <Divider section></Divider>
          <Grid.Row textAlign="center">
            <Grid.Column>
              <h3>My Top Songs</h3>
              <List
                animated
                items={this.state.top_tracks}
              />
            </Grid.Column>
            <Grid.Column>
              <h3>My Top Artists</h3>
              <List
                animated
                items={this.state.top_artists}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

export default ProfilePage;
