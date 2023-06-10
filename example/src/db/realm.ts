import Realm from 'realm';

class DataSnapshot extends Realm.Object {}
//@ts-ignore
DataSnapshot.schema = {
  name: 'DataSnapshot',
  properties: {
    time: 'double',
    speed: 'double',
    angle: 'double', //max from second
    lat: 'double?',
    lng: 'double?',
  },
};

export default new Realm({ schema: [DataSnapshot] });
