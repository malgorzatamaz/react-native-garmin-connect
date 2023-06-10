import { UpdateMode } from 'realm';
import realm from './realm';

import type { AllMessagePayload, DataSnapshot } from '../types';

const saveSnapshot = (data?: AllMessagePayload) => {
  if (!data) return;

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

const getAllSnapshots = () => {
  return realm.objects<DataSnapshot>('DataSnapshot');
};

const deleteAllSnapshots = () => {
  realm.write(() => {
    realm.deleteAll();
  });
};

export { saveSnapshot, getAllSnapshots, deleteAllSnapshots };
