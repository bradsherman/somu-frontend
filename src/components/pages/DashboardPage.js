import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { Button, Divider, List, Grid } from "semantic-ui-react";
import RoomCard from '../RoomCard';
import store from "../../store";
import api from "../../api";

class DashboardPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      owned_rooms: [],
      rooms: []
    }
    this.onClick = this.onClick.bind(this);
  }

  getRooms() {
    const user = store.getState().user.username;
    api.room.getRooms(user)
      .then(res => {
        let owned_rooms = [];
        let rooms = [];

        owned_rooms = res.data.owned_rooms.map(r =>
          (
          <List.Item key={r.ROOM_ID}
            playlist_id={r.PLAYLIST_ID}
          >
            <List.Content>
              <List.Header>
                {r.NAME}
              </List.Header>
              <List.Description>
                {r.OWNER_ID}
              </List.Description>
            </List.Content>
          </List.Item>
          )
        )
        rooms = res.data.rooms.map(r =>
          (
          <List.Item key={r.ROOM_ID}
            playlist_id={r.PLAYLIST_ID}
          >
            <List.Content>
              <List.Header>
                {r.NAME}
              </List.Header>
              <List.Description>
                {r.OWNER_ID}
              </List.Description>
            </List.Content>
          </List.Item>
          )
        )
        this.setState({owned_rooms: owned_rooms, rooms: rooms });
      })
      .catch(err => {
        console.log(err);
      })
  }

  componentDidMount() {
    this.getRooms();
  }

  onClick(e, data) {
    e.preventDefault();
    console.log(data)
    this.props.history.push('/room/'+data.playlist_id);

  }

  render() {
            // {this.state.owned_rooms && this.state.owned_rooms.map(r =>
            //   <RoomCard
            //     key={r.ROOM_ID}
            //     name={r.NAME}
            //     owner={r.OWNER_ID}
            //     playlist_id={r.PLAYLIST_ID}
            //     onClick={this.onClick}
            //   />
            // )}
    return (
      <div style={{textAlign: 'center'}}>
        <h1>My Rooms</h1>
          <div>
            <Link to="/new_room"><Button className="green">Create a Room</Button></Link>
            <Link to="/join_room"><Button primary>Join a Room</Button></Link>
            <Divider section inverted></Divider>
            <Grid columns={2}>
              <Grid.Row>
                <Grid.Column>
                  <h4>Owner</h4>
                  {this.state.owned_rooms.length > 0 ? (
                    <List
                      selection
                      animated
                      items={this.state.owned_rooms}
                      onItemClick={this.onClick}
                    />
                  ) : <div>No owned rooms yet!</div>
                  }
                </Grid.Column>
                <Grid.Column>
                  <h4>Member</h4>
                  {this.state.rooms.length > 0 ? (
                    <List
                      selection
                      animated
                      items={this.state.rooms}
                      onItemClick={this.onClick}
                    />
                  ) : <div>Join a room with your friends!</div>
                  }
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>

      </div>
    )
  };
};

export default connect(null)(DashboardPage);
