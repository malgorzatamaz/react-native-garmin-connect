import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-garmin-connect' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

export const GarminConnect = NativeModules.GarminConnect
  ? NativeModules.GarminConnect
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function initialize() {
  GarminConnect.initialize('react-native-garmin-connect-example-app');
}

export function destroy() {
  return GarminConnect.destroy();
}

export function showDevicesList() {
  return GarminConnect.showDevicesList();
}

export async function getDevicesList() {
  return await GarminConnect.getDevicesList();
}

export async function connectDevice(id: string, model: string, name: string) {
  return await GarminConnect.connectDevice(id, model, name);
}
