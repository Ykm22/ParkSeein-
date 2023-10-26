import { useCallback, useEffect, useState } from "react";
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

export const useParks: () => ParksProps = () => {
  const [fetching, setFetching] = useState<boolean>(false);
  const [fetchingError, setFetchingError] = useState<Error>();
  const [parks, setParks] = useState<ParkProps[]>();

  const addPark = useCallback(() => {
    log('addItem - TODO');
  }, []);

  useEffect(getParksEffect, []);
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
        setFetching(true);
        const parks = await getParks();

        log('fetchParks succeeded');
        if(!canceled){
          setFetching(false);
          setParks(parks);
        }
      } catch (error) {
        log('fetchParks failed');
        if(!canceled) {
          setFetching(false);
          setFetchingError(error as Error);
        }
      }
    }
  }

};