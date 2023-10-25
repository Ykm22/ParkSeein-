import React from 'react';

interface ParkProps {
  id?: string;
  description: string;
  squared_kms: number;
  last_review: Date;
  reaches_eco_target: boolean;
}

const Item: React.FC<ParkProps> = ({ id, description, squared_kms, last_review, reaches_eco_target }) => {
  return (
    <div>
        ID = {id}<br/>
        {description}<br/>
        Squared kms = {squared_kms}<br/>
        Does it reach ecological target? {reaches_eco_target ? "Yes" : "No"}<br/>
        Last review: {last_review.getDate() + "/" + last_review.getMonth() + "/" + last_review.getFullYear()}
    </div>
  );
};

export default Item;
