import React from 'react';
import { Card } from 'semantic-ui-react';

const RoomCard = ({owner, name, playlist_id, onClick}) => {
  return (
    <Card centered id={playlist_id} onClick={onClick}>
      <Card.Content textAlign="center">
        <Card.Header>{name}</Card.Header>
        <p>{owner}</p>
      </Card.Content>
    </Card>
  );
};

export default RoomCard;
