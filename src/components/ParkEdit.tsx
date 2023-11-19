import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router";
import { ParkContext } from "../contexts/ParkProvider";
import { ParkProps } from "../models/Park";
import { getLogger } from "../utils";
import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonDatetime,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonPicker,
} from "@ionic/react";
import { AuthContext } from "../auth";
import { MyPhoto, usePhotos } from "../custom_hooks/usePhotos";
import { camera } from "ionicons/icons";
import MyMap, { MarkerCoordinates } from "./MyMap";

const log = getLogger("ParkEdit");

interface ParkEditProps
  extends RouteComponentProps<{
    id?: string;
  }> {}

export interface myMapRef {
  getMarkerCoordinates: () => { lat: number; lng: number };
}

const ParkEdit: React.FC<ParkEditProps> = ({ history, match }) => {
  const { parks, saving, savingError, savePark } = useContext(ParkContext);
  const [park, setPark] = useState<ParkProps>();
  const [description, setDescription] = useState("");
  const [squared_kms, setSquaredKms] = useState(0);
  const [reaches_eco_target, setReachesEcoTarget] = useState(false);
  const [last_review, setLastReview] = useState(new Date(Date.now()));

  const { takePhoto } = usePhotos();
  const [photo, setPhoto] = useState<MyPhoto>({
    webviewPath: "",
    filepath: "",
  });

  const [coordinates, setCoordinates] = useState<MarkerCoordinates>({
    lat: 0,
    lng: 0,
  });

  const myMapRef = useRef<myMapRef | null>(null);

  // useEffect(() => {
  //   log(`new coordinates lng:${coordinates?.lng}, lat:${coordinates?.lat}`);
  // }, [coordinates]);

  useEffect(() => {
    log("useEffect");
    const routeId = match.params.id || "";
    const park = parks?.find((park) => park._id === routeId);
    setPark(park);
    if (park) {
      log(park.coordinates);
      setDescription(park.description);
      setSquaredKms(park.squared_kms);
      setReachesEcoTarget(park.reaches_eco_target);
      setLastReview(new Date(park.last_review));
      setPhoto(park.photo);
      setCoordinates(park.coordinates);
    }
  }, [match.params.id, parks]);

  const handleSave = useCallback(() => {
    const editedPark = park
      ? {
          ...park,
          description,
          squared_kms,
          reaches_eco_target,
          last_review,
          photo,
          coordinates,
        }
      : {
          description,
          squared_kms,
          reaches_eco_target,
          last_review,
          photo,
          coordinates,
        };
    savePark && savePark(editedPark).then(() => history.goBack());
  }, [
    park,
    savePark,
    description,
    squared_kms,
    reaches_eco_target,
    last_review,
    photo,
    coordinates,
    history,
  ]);

  const [showDatePicker, setShowDatepicker] = useState(false);

  const openDatepicker = () => {
    setShowDatepicker(true);
  };

  const handleDateSelection = (date: string) => {
    setLastReview(new Date(date));
  };
  log("render");
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave}>Save</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <IonItem>
            <IonInput
              label="Description: "
              value={description}
              onIonChange={(e) => setDescription(e.detail.value || "")}
            />
          </IonItem>

          <IonItem>
            <IonInput
              label="Squared Kilometers: "
              value={squared_kms}
              onIonChange={(e) => setSquaredKms(Number(e.target.value) || 0)}
            />
          </IonItem>

          <IonItem>
            <IonCheckbox
              slot="start"
              labelPlacement="start"
              checked={reaches_eco_target}
              onIonChange={(e) => setReachesEcoTarget(e.detail.checked)}
            >
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
                    <IonButton onClick={() => setShowDatepicker(false)}>
                      Close
                    </IonButton>
                  </IonButtons>
                </IonToolbar>
              </IonHeader>
              <IonContent>
                <IonDatetime
                  onIonChange={(e) =>
                    handleDateSelection(String(e.detail.value))
                  }
                  value={last_review.toISOString()}
                ></IonDatetime>
              </IonContent>
            </IonModal>
          </IonItem>

          <IonImg onClick={() => log("hi")} src={photo?.webviewPath} />
          <IonFabButton
            onClick={async () => {
              const newPhoto = await takePhoto();
              setPhoto(newPhoto);
            }}
          >
            <IonIcon icon={camera} />
          </IonFabButton>
          {coordinates && coordinates.lat && coordinates.lng && (
            <MyMap
              lat={coordinates.lat}
              lng={coordinates.lng}
              setCoordinates={setCoordinates}
            />
          )}
          <IonLoading isOpen={saving} />
          {savingError && (
            <div>{savingError.message || "Failed to save park"}</div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ParkEdit;
