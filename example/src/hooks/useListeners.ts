import { useMemo } from 'react';
import { Platform, NativeEventEmitter, DeviceEventEmitter } from 'react-native';
import { GarminConnect } from 'react-native-garmin-connect';

const useListeners = () => {
  const emitter = useMemo(() => {
    if (Platform.OS === 'ios') {
      return new NativeEventEmitter(GarminConnect);
    }
    return DeviceEventEmitter;
  }, []);

  const addListener = (type: string, listener: (data: any) => void) =>
    emitter.addListener(type, listener);

  return { addListener };
};

export default useListeners;
