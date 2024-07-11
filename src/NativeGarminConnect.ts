import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { Device } from 'react-native-garmin-connect';

export interface Spec extends TurboModule {
  initGarminSDK(urlParam?: string): void;
  destroy(): void;
  showDevicesList(): void;
  getDevicesList(): Promise<Device[]>;
  connectDevice(id: string, model: string, name: string): void;
  sendMessage(message: string): void;
  addListener: (eventType: string) => void;
  removeListeners: (count: number) => void;
}

export default TurboModuleRegistry.get<Spec>('GarminConnect') as Spec | null;
