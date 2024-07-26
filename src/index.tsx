import { NativeModules, Platform } from 'react-native';
import type { Spec } from './NativeGarminConnect';

/**
 * Device type
 */
export type Device = {
  id: string;
  model: string;
  name: string;
  status: Status;
};

/**
 * Known device status
 * OFFLINE means it's not in reach
 * ONLINE means it's in reach and ready to connect
 * CONNECTED means it's ONLINE and subscribed for receiving messages
 */
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

/**
 * Garmin Connect module. It's used for subscribing to Event Emitter.
 */
export const GarminConnect: Spec = GarminConnectModule
  ? GarminConnectModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

/**
 * Initialize Garmin Connect SDK
 * @param {string} schemaUrl
 */
export function initialize(schemaUrl: string) {
  GarminConnect.initGarminSDK(schemaUrl);
}

/**
 * Cleanup Garmin Connect SDK
 */
export function destroy() {
  GarminConnect.destroy();
}

/**
 * Allows to fetch list of devices (added in Garmin Connect app) on ios platform
 */
export function showDevicesList() {
  Platform.OS === 'ios' ? GarminConnect.showDevicesList() : () => {};
}

/**
 * Promise based function that returns devices added in Garmin Connect app
 */
export async function getDevicesList(): Promise<Device[]> {
  return await GarminConnect.getDevicesList();
}

/**
 * Connects selected device and subscribes for receiving messages
 * @param {string} id
 * @param {string} model
 * @param {string} name
 */
export function connectDevice(id: string, model: string, name: string) {
  GarminConnect.connectDevice(id, model, name);
}

/**
 * Functions that send message to watch
 * Warning! it wasn't tested, may not work properly
 * @param {string} message
 */
export function sendMessage(message: string) {
  GarminConnect.sendMessage(message);
}
