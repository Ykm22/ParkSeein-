import { useCallback, useState } from "react";
import { getLogger } from "../utils";

const log = getLogger('useParks');

export interface ParkProps {
  id?: string;
  description: string;
  squared_kms: number;
  last_review: Date;
  reaches_eco_target: boolean;
}

export interface ParksProps {
  parks: ParkProps[],
  addPark: () => void,
}

export const useParks: () => ParksProps = () => {
  const [parks, setParks] = useState([
    {id:"0", description: "Park 1", squared_kms:22, last_review: new Date(Date.now()), reaches_eco_target: true},
    {id:"1", description: "Park 2", squared_kms:30, last_review: new Date(Date.now()), reaches_eco_target: false},
  ]);
  const addPark = useCallback(() => {
    const id = `${parks.length + 1}`;
    log('addPark');
    setParks(parks.concat({id, description: "new park", squared_kms:40, last_review: new Date(Date.now()), reaches_eco_target: false}));
  }, [parks]);
  log('returns');
  return {
    parks,
    addPark,
  };
};