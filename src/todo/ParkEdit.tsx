import { useCallback, useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { ParkContext } from "./ParkProvider";
import { ParkProps } from "./Park";
import { getLogger } from "../utils";
import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonLoading, IonPage, IonTitle, IonToolbar } from "@ionic/react";

const log = getLogger('ParkEdit');

interface ParkEditProps extends RouteComponentProps<{
  id?: string,
}> {}

const ParkEdit: React.FC<ParkEditProps> = ({ history, match }) => {
  const { parks, saving, savingError, savePark } = useContext(ParkContext);
  const [ park, setPark ] = useState<ParkProps>();
  const [ description, setDescription ] = useState('');
  const [ squared_kms, setSquaredKms ] = useState(0);
  const [ reaches_eco_target, setReachesEcoTarget ] = useState(false);
  const [ last_review, setLastReview ] = useState(new Date(Date.now()));
  useEffect(() => {
    log('useEffect');
    const routeId = match.params.id || '';
    const park = parks?.find(park => park.id === routeId);
    setPark(park);
    if (park) {
      setDescription(park.description);
      setSquaredKms(park.squared_kms);
      setReachesEcoTarget(park.reaches_eco_target);
      setLastReview(park.last_review);
    }
  }, [match.params.id, parks]);

  const handleSave = useCallback(() => {
    const editedPark = park 
      ? { ...park, description, squared_kms, reaches_eco_target, last_review } 
      : { description, squared_kms, reaches_eco_target, last_review };
    savePark && savePark(editedPark).then(() => history.goBack());
  }, [park, savePark, description, squared_kms, reaches_eco_target, last_review, history]); 

  log('render');
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave}>
              Save
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonInput value={description} onIonChange={e => setDescription(e.detail.value || '')}/>
        <IonLoading isOpen={saving}/>
        {savingError && (
          <div>{savingError.message || 'Failed to save park'}</div>
        )}
      </IonContent>
    </IonPage>
  ) 
};

export default ParkEdit;