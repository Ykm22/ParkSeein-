import { useCallback, useEffect, useReducer, useState } from "react";
import { getLogger } from "../utils";
import { getParks } from './parkApi';

const log = getLogger('useParks');

export interface ParkProps {
  id?: string;
  description: string;
  squared_kms: number;
  last_review: Date;
  reaches_eco_target: boolean;
}

export interface ParksState {
  parks?: ParkProps[],
  fetching: boolean,
  fetchingError?: Error,
}

export interface ParksProps extends ParksState {
  addPark: () => void,
}

interface ActionProps {
  type: string,
  payload?: any,
}

const FETCH_PARKS_STARTED = 'FETCH_PARKS_STARTED';
const FETCH_PARKS_SUCCEEDED = 'FETCH_PARKS_SUCCEEDED';
const FETCH_PARKS_FAILED = 'FETCH_PARKS_FAILED';

const initialState: ParksState = {
  parks: undefined,
  fetching: false,
  fetchingError: undefined,
};

const reducer: (state: ParksState, action: ActionProps) => ParksState =
  (state, {type, payload}) => {
    switch(type) {
      case FETCH_PARKS_STARTED:
        return { ...state, fetching: true };
      case FETCH_PARKS_SUCCEEDED:
        return { ...state, parks: payload.parks, fetching: false };
      case FETCH_PARKS_FAILED:
        return { ...state, fetchingError: payload.error, fetching: false };
      default:
        return state;
    }
  };

export const useParks: () => ParksProps = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { parks, fetching, fetchingError } = state;

  const addPark = useCallback(() => {
    log('addItem - TODO');
  }, []);

  useEffect(getParksEffect, [dispatch]);
  log(`returns - fetching = ${fetching}, parks = ${JSON.stringify(parks)}`);

  return {
    parks,
    fetching,
    fetchingError,
    addPark,
  };

  function getParksEffect() {
    let canceled = false;
    fetchParks();
    return () => {
      canceled = true;
    }

    async function fetchParks() {
      try {
        log('fetchParks started');
        dispatch({ type: FETCH_PARKS_STARTED });
        const parks = await getParks();

        log('fetchParks succeeded');
        if(!canceled){
          dispatch({ type: FETCH_PARKS_SUCCEEDED, payload: { parks }});
        }
      } catch (error) {
        log('fetchParks failed');
        if(!canceled) {
          dispatch({ type: FETCH_PARKS_FAILED, payload: { error }});
        }
      }
    }
  }

};