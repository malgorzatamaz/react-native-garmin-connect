export type Device = { name: string; status: Status };

export enum Status {
  CONNECTED,
  DISCONNECTED,
}
