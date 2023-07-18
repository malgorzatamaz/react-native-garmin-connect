export type Device = { name: string; status: Status };

export enum Status {
  CONNECTED = 'CONNECTED',
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

export enum MessageType {
  ALL = 'MESSAGE_TYPE_ALL',
}

export type Message = { payload: string; type: MessageType };

export type AllMessagePayload = {
  time: string;
  speed: string;
  maxAngle: string;
  lat?: string;
  lng?: string;
};

export type DataSnapshot = {
  time: number;
  speed: number;
  angle: number;
  lat: number;
  lng: number;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
  time: number;
};
