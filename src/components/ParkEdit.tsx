import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router";
import { ParkContext } from "../contexts/ParkProvider";
import { ParkProps } from "../models/Park";
import { getLogger } from "../utils";
import { IonButton, IonButtons, IonCheckbox, IonContent, IonDatetime, IonHeader, IonInput, IonItem, IonLabel, IonList, IonLoading, IonModal, IonPage, IonTitle, IonToolbar, useIonPicker } from "@ionic/react";

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
      setLastReview(new Date(park.last_review));
    }
  }, [match.params.id, parks]);


  const handleSave = useCallback(() => {
    const editedPark = park 
      ? { ...park, description, squared_kms, reaches_eco_target, last_review } 
      : { description, squared_kms, reaches_eco_target, last_review };
    savePark && savePark(editedPark).then(() => history.goBack());
  }, [park, savePark, description, squared_kms, reaches_eco_target, last_review, history]); 

  const [showDatePicker, setShowDatepicker] = useState(false);

  const openDatepicker = () => {
    setShowDatepicker(true);
  }

  const handleDateSelection = (date: string) => {
    setLastReview(new Date(date));
  }
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
        <div style={{ display: 'flex', flexDirection:'column'}}>
          <IonItem>
            <IonInput label='Description: ' value={description} onIonChange={e => setDescription(e.detail.value || '')}/>
          </IonItem>
          <IonItem>
            <IonInput label='Squared Kilometers: ' value={squared_kms} onIonChange={e => setSquaredKms(Number(e.target.value) || 0)}/>
          </IonItem>
          <IonItem>
            <IonCheckbox 
              slot="start" labelPlacement="start" checked={reaches_eco_target} onIonChange={e => setReachesEcoTarget(e.detail.checked)}>
              Reaches eco target
              </IonCheckbox> 
          </IonItem>
          <IonItem> 
            <IonButton onClick={openDatepicker}>Review Date</IonButton>
            <IonModal isOpen={showDatePicker}>
              <IonHeader>
                <IonToolbar>
                  <IonTitle>Select a Date</IonTitle>
                  <IonButtons slot="end">
                    <IonButton onClick={() => setShowDatepicker(false)}>Close</IonButton>
                  </IonButtons>
                </IonToolbar>
              </IonHeader>
              <IonContent>
                <IonDatetime
                  onIonChange={(e) => handleDateSelection(String(e.detail.value))}
                  value={last_review.toISOString()}
                ></IonDatetime>
              </IonContent>
            </IonModal>

          </IonItem>
          <IonLoading isOpen={saving}/>
          {savingError && (
            <div>{savingError.message || 'Failed to save park'}</div>
          )}
        </div>
      </IonContent>
    </IonPage>
  ) 
};

export default ParkEdit;