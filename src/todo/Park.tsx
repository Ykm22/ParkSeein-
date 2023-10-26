import { IonItem, IonLabel } from '@ionic/react';
import React, { memo } from 'react';

export interface ParkProps {
  id?: string;
  description: string;
  squared_kms: number;
  last_review: Date;
  reaches_eco_target: boolean;
}

interface ParkPropsExt extends ParkProps {
  onEdit: (id?: string) => void;
}

const Park: React.FC<ParkPropsExt> = ({ id, description, squared_kms, last_review, reaches_eco_target, onEdit }) => {
  return (
    <IonItem onClick={() => onEdit(id)}>
      <IonLabel>{description}</IonLabel>
    </IonItem>
  );
};

export default memo(Park);
