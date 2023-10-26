import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonList, IonLoading, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { add } from 'ionicons/icons';
import React, { useCallback, useMemo, useState } from 'react';
import Park from './Park';
import { getLogger } from '../utils';
import { useParks } from './useParks';


const log = getLogger('ParkList');

const ParkList: React.FC = () => {
  const { parks, fetching, fetchingError, addPark } = useParks();

  log('render');  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>ParkSeein'</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading isOpen={fetching} message="Loading parks"/>
        {parks && (
          <IonList>
            {parks.map((
              {id, description, squared_kms, last_review, reaches_eco_target}) => 
              <Park key={id} id={id} 
                description={description} 
                squared_kms={squared_kms} 
                last_review={last_review} 
                reaches_eco_target={reaches_eco_target}
              />
            )}
          </IonList>
        )}
        {fetchingError && (
          <div>{fetchingError.message || 'Failed to load parks'}</div>
        )}
        <IonFab vertical='bottom' horizontal='end' slot='fixed'>
          <IonFabButton onClick={addPark}>
              <IonIcon icon={add}/>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default ParkList;
