import React, { useCallback, useEffect, useState } from 'react';
import { DeviceEventEmitter, FlatList, ListRenderItem } from 'react-native';

import {
  getKnownDeviceList,
  getConnectedDeviceList,
} from 'react-native-garmin-connect';

import { DevicesListItem } from './DevicesListItem';
import { Device, Status } from '../../types';

type Props = {
  isSdkReady: boolean;
};

export const DevicesList = ({ isSdkReady }: Props) => {
  const [devices, setDevices] = useState([]);

  const getDevices = async () => {
    const knownDevices = await getKnownDeviceList();
    const connectedDevices = await getConnectedDeviceList();

    const mappedDevices = knownDevices.map((knownDevice: string) => {
      const isDeviceConnected = !!connectedDevices.find(
        (connectedDevice: string) => connectedDevice === knownDevice
      );
      return {
        name: knownDevice,
        status: isDeviceConnected ? Status.CONNECTED : Status.DISCONNECTED,
      };
    });

    setDevices(mappedDevices);
  };

  const onDeviceStatusChanged = useCallback((status: string) => {
    getDevices();
    console.log('status', status);
  }, []);

  useEffect(() => {
    if (isSdkReady) getDevices();

    DeviceEventEmitter.addListener('onError', onError);
    DeviceEventEmitter.addListener(
      'onDeviceStatusChanged',
      onDeviceStatusChanged
    );
  }, [isSdkReady, onDeviceStatusChanged]);

  const onError = (error: string) => {
    console.log('onError', error);
  };

  const renderItem: ListRenderItem<Device> = ({ item }) => (
    <DevicesListItem item={item} />
  );

  return (
    <FlatList<Device>
      testID="deviceList"
      data={devices}
      renderItem={renderItem}
    />
  );
};
