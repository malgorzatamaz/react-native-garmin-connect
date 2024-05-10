import { NativeModules, Platform } from 'react-native';

export type Device = {
  id: string;
  model: string;
  name: string;
  status: Status;
};

export enum Status {
  CONNECTED = 'CONNECTED',
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

const LINKING_ERROR =
  `The package 'react-native-garmin-connect' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const GarminConnectModule = isTurboModuleEnabled
  ? require('./NativeGarminConnect').default
  : NativeModules.GarminConnect;

export const GarminConnect = GarminConnectModule
  ? GarminConnectModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function initialize() {
  Platform.OS === 'ios'
    ? GarminConnect.initGarminSDK('react-native-garmin-connect-example-app')
    : GarminConnect.initGarminSDK();
}

export function destroy() {
  return GarminConnect.destroy();
}

export function showDevicesList() {
  return Platform.OS === 'ios' ? GarminConnect.showDevicesList() : () => {};
}

export async function getDevicesList() {
  return await GarminConnect.getDevicesList();
}

export async function connectDevice(id: string, model: string, name: string) {
  return await GarminConnect.connectDevice(id, model, name);
}
