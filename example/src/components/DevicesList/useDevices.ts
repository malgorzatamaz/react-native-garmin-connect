import { useCallback, useEffect, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { getDevicesList } from 'react-native-garmin-connect';

import { Status } from '../../types';

export const useDevices = (isSdkReady: boolean) => {
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState<string | undefined>();

  const getDevices = useCallback(async () => {
    const devicesList = await getDevicesList();
    setDevices(devicesList);
  }, []);

  const onDeviceStatusChanged = useCallback(
    ({ name, status }: { name: string; status: string }) => {
      if (status === Status.CONNECTED) {
        setConnectedDevice(name);
      }
    },
    []
  );

  useEffect(() => {
    if (isSdkReady) getDevices();

    DeviceEventEmitter.addListener('onError', onError);
    DeviceEventEmitter.addListener(
      'onDeviceStatusChanged',
      onDeviceStatusChanged
    );
  }, [getDevices, isSdkReady, onDeviceStatusChanged]);

  const onError = (error: string) => {
    console.log('onError', error);
  };

  return {
    devices,
    refreshDevices: getDevices,
    connectedDevice,
  };
};
