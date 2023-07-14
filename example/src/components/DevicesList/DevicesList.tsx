import React, { useCallback, useEffect, useState } from 'react';
import {
  DeviceEventEmitter,
  FlatList,
  ListRenderItem,
  StyleSheet,
} from 'react-native';
import { Button, Text } from 'react-native-paper';
import { getDevicesList } from 'react-native-garmin-connect';

import { DevicesListItem } from './DevicesListItem';
import { Device, Status } from '../../types';

type Props = {
  isSdkReady: boolean;
};

export const DevicesList = ({ isSdkReady }: Props) => {
  const [devices, setDevices] = useState([]);
  const [connectDevice, setConnectedDevice] = useState<string | undefined>();

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

  const renderItem: ListRenderItem<Device> = ({ item }) => (
    <DevicesListItem item={item} isConnected={item.name === connectDevice} />
  );

  const refresh = () => {
    getDevices();
  };

  return (
    <>
      <Text style={styles.title} variant="headlineMedium">
        Devices
      </Text>
      <FlatList<Device>
        testID="deviceList"
        data={devices}
        ListEmptyComponent={<Text variant="bodyMedium">No devices found</Text>}
        renderItem={renderItem}
      />
      <Button mode="contained" style={styles.button} onPress={refresh}>
        Refresh
      </Button>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 30,
  },
  title: { padding: 20 },
});
