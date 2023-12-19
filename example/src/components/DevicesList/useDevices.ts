import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { getDevicesList, showDevicesList } from 'react-native-garmin-connect';
import { Status } from '../../types';
import useListeners from '../../hooks/useListeners';

export const useDevices = (isSdkReady: boolean) => {
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState<string | undefined>();
  const { addListener } = useListeners();

  const getDevices = useCallback(async () => {
    if (Platform.OS === 'ios') showDevicesList();

    const devicesList = await getDevicesList();
    setDevices(devicesList);
  }, []);

  const onDeviceStatusChanged = useCallback(
    ({ name, status }: { name: string; status: string }) => {
      console.log('onDeviceStatusChanged', name, status);
      if (status === Status.CONNECTED) {
        setConnectedDevice(name);
      }
    },
    []
  );

  useEffect(() => {
    if ((isSdkReady || Platform.OS === 'ios') && devices.length === 0) {
      getDevices();
    }
  }, [devices.length, getDevices, isSdkReady]);

  useEffect(() => {
    const onErrorListener = addListener('onError', onError);
    const onStatusChangedListener = addListener(
      'onDeviceStatusChanged',
      onDeviceStatusChanged
    );
    () => {
      onErrorListener.remove();
      onStatusChangedListener.remove();
    };
  }, [
    addListener,
    devices.length,
    getDevices,
    isSdkReady,
    onDeviceStatusChanged,
  ]);

  const onError = (error: string) => {
    console.log('onError', error);
  };

  return {
    devices,
    refreshDevices: getDevices,
    connectedDevice,
  };
};
