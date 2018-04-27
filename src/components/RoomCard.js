import React from 'react';
import { Card } from 'semantic-ui-react';

const RoomCard = ({owner, name}) => {
  return (
    <Card centered>
      <Card.Content textAlign="center">
        <Card.Header>{name}</Card.Header>
        <p>{owner}</p>
      </Card.Content>
    </Card>
  );
};

export default RoomCard;
