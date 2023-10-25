import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { add } from 'ionicons/icons';
import React, { useCallback, useMemo, useState } from 'react';
import Park from './Park';
import { getLogger } from '../utils';


const log = getLogger('ParkList');

const ParkList: React.FC = () => {
  const [parks, setParks] = useState([
    {id:"0", description: "Park 1", squared_kms:22, last_review: new Date(Date.now()), reaches_eco_target: true},
    {id:"1", description: "Park 2", squared_kms:30, last_review: new Date(Date.now()), reaches_eco_target: false},
  ]);

  let count = useMemo(() => {
    log('Calculate count');
    return parks.length;
  }, [parks]);

  const addItem = useCallback(() => {
    const id = `${parks.length + 1}`;
    log('addItem');
    setParks(parks.concat({id, description: "new park", squared_kms:40, last_review: new Date(Date.now()), reaches_eco_target: false}));
  }, [parks, setParks]);

  log('render');  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>ParkSeein'</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div>Item count: {count}</div>
        {parks.map(({id, description, squared_kms, last_review, reaches_eco_target}) => 
          <Park key={id} id={id} 
            description={description} 
            squared_kms={squared_kms} 
            last_review={last_review} 
            reaches_eco_target={reaches_eco_target}
          />)}
          <IonFab vertical='bottom' horizontal='end' slot='fixed'>
            <IonFabButton onClick={addItem}>
                <IonIcon icon={add}/>
            </IonFabButton>
          </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default ParkList;
