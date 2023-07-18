import { Results, UpdateMode } from 'realm';
import realm from './realm';

import type { AllMessagePayload, DataSnapshot } from '../types';

export type DataSnapshotResult = Results<
  {
    time: number;
    speed: number;
    angle: number;
    lat: number;
    lng: number;
  } & Realm.Object
>;

const saveSnapshot = (data?: AllMessagePayload) => {
  if (!data) return;
  console.log(data);

  realm.write(() => {
    realm.create(
      'DataSnapshot',
      {
        time: parseFloat(data.time),
        speed: parseFloat(data.speed),
        angle: parseFloat(data.maxAngle),
        lat: data.lat ? parseFloat(data.lat) : null,
        lng: data.lng ? parseFloat(data.lng) : null,
      },
      UpdateMode.Modified
    );
  });
};

const getAllSnapshots = (): DataSnapshotResult => {
  return realm.objects<DataSnapshot>('DataSnapshot');
};

const deleteAllSnapshots = () => {
  realm.write(() => {
    realm.deleteAll();
  });
};

export { saveSnapshot, getAllSnapshots, deleteAllSnapshots };
