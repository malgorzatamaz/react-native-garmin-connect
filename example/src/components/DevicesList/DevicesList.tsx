import React from 'react';
import { FlatList, StyleSheet, type ListRenderItem } from 'react-native';
import { Button, Text } from 'react-native-paper';
import type { Device } from 'react-native-garmin-connect';

import { DevicesListItem } from './DevicesListItem';
import { useDevices } from './useDevices';

type Props = {
  isSdkReady: boolean;
};

export const DevicesList = ({ isSdkReady }: Props) => {
  const { devices, refreshDevices, connectedDevice } = useDevices(isSdkReady);
  const renderItem: ListRenderItem<Device> = ({ item }) => {
    return (
      <DevicesListItem
        item={item}
        isConnected={item.name === connectedDevice}
      />
    );
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
      <Button mode="contained" style={styles.button} onPress={refreshDevices}>
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
