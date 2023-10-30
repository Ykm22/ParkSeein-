import { createContext, useCallback, useContext, useEffect, useReducer } from "react";
import { ParkProps } from "../models/Park";
import PropTypes from 'prop-types';
import { getLogger } from "../utils";
import { getParks, updatePark, createPark, newWebSocket } from "../network/parkApi";
import { AuthContext } from "../auth";

const log = getLogger('ParkProvider');

type SaveParkFn = (park: ParkProps) => Promise<any>;

export interface ParksState {
  parks?: ParkProps[],
  fetching: boolean,
  fetchingError?: Error | null,
  saving: boolean,
  savingError?: Error | null,
  savePark?: SaveParkFn,
}

const initialState: ParksState = {
  fetching: false,
  saving: false,
}

export const ParkContext = createContext<ParksState>(initialState);

interface ParkProviderProps {
  children: PropTypes.ReactNodeLike,
}

interface ActionProps {
  type: string,
  payload?: any,
}

const FETCH_PARKS_STARTED = 'FETCH_PARKS_STARTED'; 
const FETCH_PARKS_SUCCEEDED = 'FETCH_PARKS_SUCCEEDED';
const FETCH_PARKS_FAILED = 'FETCH_PARKS_FAILED';
const SAVE_PARK_STARTED = 'SAVE_PARK_STARTED';
const SAVE_PARK_SUCCEEDED = 'SAVE_PARK_SUCCEEDED';
const SAVE_PARK_FAILED = 'SAVE_PARK_FAILED';

const reducer: (state: ParksState, action: ActionProps) => ParksState = 
  (state, { type, payload }) => {
    switch(type) {
      case FETCH_PARKS_STARTED:
        return { ...state, fetching: true, fetchingError: null };
      case FETCH_PARKS_SUCCEEDED:
        return { ...state, fetching: false, parks: payload.parks };
      case FETCH_PARKS_FAILED:
        return { ...state, fetching: false, fetchingError: payload.error };
      case SAVE_PARK_STARTED:
        return { ...state, saving: true, savingError: null};
      case SAVE_PARK_SUCCEEDED:
        const parks = [ ...(state.parks || [])];
        const saved_park = payload.park;
        const index = parks.findIndex(park => park._id === saved_park._id);
        if(index === -1) {
          parks.splice(0, 0, saved_park);
        } else {
          parks[index] = saved_park;
        }
        return { ...state, saving: false, parks };
      case SAVE_PARK_FAILED:
        return { ...state, saving: false, savingError: payload.error };
      default:
        return state;
    }
  }

export const ParkProvider: React.FC<ParkProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { parks, fetching, fetchingError, saving, savingError } = state;
  
  const { token } = useContext(AuthContext);

  useEffect(getParksEffect, [token]);
  useEffect(wsEffect, [token]);

  const savePark = useCallback<SaveParkFn>(saveParkCallback, []);
  const value = { parks, fetching, fetchingError, saving, savingError, savePark };
  log('returns');

  return (
    <ParkContext.Provider value={value}>
      {children}
    </ParkContext.Provider>  
  )

  function getParksEffect() {
    let canceled = false;
    if (token) {
      log('fetching parks');
      fetchParks();
    }

    return () => {
      canceled = true;
    }

    async function fetchParks() {
      try {
        log('fetchParks');
        dispatch({ type: FETCH_PARKS_STARTED });
        const parks = await getParks(token);
        log('fetchParks succeeded');
        if (!canceled) {
          parks.forEach(park => park.last_review = new Date(park.last_review));
          dispatch({ type: FETCH_PARKS_SUCCEEDED, payload: { parks }});
        }
      } catch (error) {
        log('fetchParks failed');
        if (!canceled) {
          dispatch({ type: FETCH_PARKS_FAILED, payload: { error }});
        }
      }
    }
  }

  async function saveParkCallback(park: ParkProps) {
    try {
      log('savePark started');
      dispatch({ type: SAVE_PARK_STARTED });
      const savedPark = await (park._id ? updatePark(token, park) : createPark(token, park));
      log('savePark succeeded');
      dispatch({ type: SAVE_PARK_SUCCEEDED, payload: { park: savedPark } });
    } catch (error) {
      log('savePark failed');
      dispatch({ type: SAVE_PARK_FAILED, payload: { error } });
    }
  }

  function wsEffect() {
    let canceled = false;
    log('wsEffect - connecting');
    let closeWebSocket: () => void;
    if (token?.trim()){
      closeWebSocket = newWebSocket(token, message => {
        if (canceled) {
          return;
        }
  
        const { event, payload: { park }} = message;
        log(`ws message, park ${event}`);
  
        if (event === 'created' || event === 'updated') {
          dispatch({ type: SAVE_PARK_SUCCEEDED, payload: { park }});
        }
      });
    }

    return () => {
      log('wsEffect - disconnecting');
      canceled = true;
      closeWebSocket?.();
    }
  }
};