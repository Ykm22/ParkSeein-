import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import Park from './Park';

const ItemList: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>ParkSeein'</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Park text="Park 1"/>
        <Park text="Park 2"/>
      </IonContent>
    </IonPage>
  );
};

export default ItemList;
