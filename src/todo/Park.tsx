import React from 'react';

interface ParkProps {
  id?: string;
  text: string;
}

const Item: React.FC<ParkProps> = ({ id, text }) => {
  return (
    <div>{text}</div>
  );
};

export default Item;
