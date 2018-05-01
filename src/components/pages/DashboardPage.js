import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { Button, Divider } from "semantic-ui-react";
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
        this.setState({owned_rooms: res.data.owned_rooms, rooms: res.data.rooms });
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
    this.props.history.push('/room/'+data.id);

  }

  render() {
    return (
      <div style={{textAlign: 'center'}}>
        <h1>My Rooms</h1>
          <div>
            <Link to="/new_room"><Button className="green">Create a Room</Button></Link>
            <Link to="/join_room"><Button primary>Join a Room</Button></Link>
            <h5>Owner</h5>
            {this.state.owned_rooms && this.state.owned_rooms.map(r =>
              <RoomCard
                key={r.ROOM_ID}
                name={r.NAME}
                owner={r.OWNER_ID}
                playlist_id={r.PLAYLIST_ID}
                onClick={this.onClick}
              />
            )}
            <Divider section />
            <h5>Member</h5>
            {this.state.rooms && this.state.rooms.map(r =>
              <RoomCard
                key={r.ROOM_ID}
                name={r.NAME}
                owner={r.OWNER_ID}
                playlist_id={r.PLAYLIST_ID}
                onClick={this.onClick}
              />
            )}
          </div>

      </div>
    )
  };
};

export default connect(null)(DashboardPage);
