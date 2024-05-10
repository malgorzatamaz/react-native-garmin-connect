import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { Device } from 'react-native-garmin-connect';

export interface Spec extends TurboModule {
  initGarminSDK(urlParam?: string): void;
  destroy(): void;
  showDevicesList(): void;
  getDevicesList(urlParam?: string): Promise<Device[]>;
  connectDevice(id: string, model: string, name: string): Promise<string>;
  sendMessage(message: string): void;
}

export default TurboModuleRegistry.get<Spec>('GarminConnect') as Spec | null;
