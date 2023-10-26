import axios from "axios";
import { ParkProps } from "./useParks";
import { getLogger } from "../utils";

const log = getLogger('parkApi');
const baseUrl = 'http://localhost:3000';

export const getParks: () => Promise<ParkProps[]> = () => {
    log('getParks - started');
    return axios
        .get(`${baseUrl}/parks`)
        .then(res => {
            log('getParks - succeeded');
            res.data = res.data.map((park: ParkProps) => {
                return {
                    ...park,
                    last_review: new Date(park.last_review), 
                }
            })
            return Promise.resolve(res.data);
        })
        .catch(err => {
            log('getParks - failed');
            return Promise.reject(err);
        });
}