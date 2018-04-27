import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from "semantic-ui-react";
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
  }

  getRooms() {
    const user = store.getState().user.username;
    api.room.getRooms(user)
      .then(res => {
        this.setState({owned_rooms: res.data.owned_rooms });//, rooms: res.rooms});
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
    console.log(e);
    console.log(data);
  }

  render() {
            // set props here
            // {this.state.owned_rooms.map(r => <RoomCard />)}
            // {this.state.owned_rooms[0] &&
            //   <RoomCard key={this.state.owned_rooms[0].room_id} name={this.state.owned_rooms[0].name} owner={this.state.owned_rooms[0].owner_id}/>
            // }
              // console.log('map of owned rooms');
              // console.log(r);
              // return (
              //   // <div key={r.room_id}>{r.name}</div>
              // )
    return (
      <div style={{textAlign: 'center'}}>
        <h1>Dashboard Page</h1>
          <div>
            <h3>My Rooms</h3>
            <Link to="/room/new"><Button className="green">Create a Room</Button></Link>
            {this.state.owned_rooms && this.state.owned_rooms.map(r =>
              <RoomCard
                key={r.ROOM_ID}
                name={r.NAME}
                owner={r.OWNER_ID}
                onClick={this.onClick}
              />
            )}
          </div>

      </div>
    )
  };
};

export default connect(null)(DashboardPage);
