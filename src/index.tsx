import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-garmin-connect' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const GarminConnect = NativeModules.GarminConnect
  ? NativeModules.GarminConnect
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function init() {
  return GarminConnect.init();
}

export function destroy() {
  return GarminConnect.destroy();
}

export async function getKnownDevicesList() {
  return await GarminConnect.getKnownDevicesList();
}

export async function getAvailableDevicesList() {
  return await GarminConnect.getAvailableDevicesList();
}

export async function getDevicesList() {
  return await GarminConnect.getDevicesList();
}

export async function connectDevice(name: string) {
  return await GarminConnect.connectDevice(name);
}
