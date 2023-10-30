import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonList, IonLoading, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { add } from 'ionicons/icons';
import React, { useContext } from 'react';
import Park from '../models/Park';
import { getLogger } from '../utils';
import { ParkContext } from '../contexts/ParkProvider';
import { RouteComponentProps } from 'react-router';

const log = getLogger('ParkList');

const ParkList: React.FC<RouteComponentProps> = ({ history }) => {
  const { parks, fetching, fetchingError } = useContext(ParkContext);
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
            {parks.map(({_id, description, squared_kms, last_review, reaches_eco_target}) => 
              <Park key={_id} _id={_id}
                description={description} 
                squared_kms={squared_kms} 
                last_review={last_review} 
                reaches_eco_target={reaches_eco_target}
                onEdit={id => history.push(`/park/${id}`)}
              />
            )}
          </IonList>
        )}
        {fetchingError && (
          <div>{fetchingError.message || 'Failed to load parks'}</div>
        )}
        <IonFab vertical='bottom' horizontal='end' slot='fixed'>
          <IonFabButton onClick={() => history.push('/park')}>
              <IonIcon icon={add}/>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default ParkList;
