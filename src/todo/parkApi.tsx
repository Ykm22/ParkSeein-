import axios from "axios";
import { ParkProps } from "./Park";
import { getLogger } from "../utils";

const log = getLogger('parkApi');
const baseUrl = 'localhost:3000';
const parkUrl = `http://${baseUrl}/parks`;

const config = {
  headers: {
    'Content-Type': 'application/json'
  }
};

interface ResponseProps<T> {
  data: T;
}

function withLogs<T>(promise: Promise<ResponseProps<T>>, fnName: string): Promise<T> {
  log(`${fnName} - started`);
  return promise
    .then(res => {
      log(`${fnName} - succeeded`);
      return Promise.resolve(res.data);
    })
    .catch(error => {
      log(`${fnName} - failed`);
      return Promise.reject(error);
    });
}

export const getParks: () => Promise<ParkProps[]> = () => {
  return withLogs(axios.get(parkUrl, config), 'getParks');
}

export const createPark: (park: ParkProps) => Promise<ParkProps[]> = park => {
  return withLogs(axios.post(parkUrl, park, config), 'createPark');
}

export const updatePark: (park: ParkProps) => Promise<ParkProps[]> = park => {
  return withLogs(axios.put(`${parkUrl}/${park.id}`, park, config), 'updatePark');
}

interface MessageData {
  event: string,
  payload: {
    park: ParkProps;
  };
}

export const newWebSocket = (onMessage: (data: MessageData) => void) => {
  const ws = new WebSocket(`ws://${baseUrl}`);
  ws.onopen = () => {
    log('web socket onopen');
  };
  
  ws.onclose = () => {
    log('web socket onclose');
  };

  ws.onerror = error => {
    log(error);
    log(`web socket onerror, ${error}`);
  };

  ws.onmessage = messageEvent => {
    log('web socket onmessage');
    onMessage(JSON.parse(messageEvent.data));
  };
  
  return () => {
    ws.close();
  }
}