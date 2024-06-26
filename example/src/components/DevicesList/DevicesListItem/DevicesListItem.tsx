import React, { memo, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  Status,
  connectDevice,
  type Device,
} from 'react-native-garmin-connect';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { DeviceStatus } from '../DeviceStatus';

type Props = { item: Device; isConnected: boolean };

export const DevicesListItem = memo(({ item, isConnected }: Props) => {
  const onPress = useCallback(() => {
    connectDevice(item.id, item.model, item.name);
  }, [item]);

  const isWatch = item?.name?.toLowerCase().includes('fenix');

  return (
    <TouchableOpacity
      onPress={onPress}
      testID={`deviceListItem_${item.name}`}
      style={styles.container}
      disabled={item.status === Status.OFFLINE}
    >
      <View style={[styles.container]}>
        {isWatch ? (
          <MaterialCommunityIcons name="watch" color="black" size={35} />
        ) : (
          <MaterialCommunityIcons name="cellphone" color="black" size={35} />
        )}
        <Text style={styles.text} variant="bodyMedium" testID="name">
          {item.name}
        </Text>
        {isConnected ? (
          <MaterialCommunityIcons name="connection" color="black" size={26} />
        ) : null}
        <DeviceStatus status={item.status} />
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    height: 60,
    width: '100%',
    padding: 10,
  },
  text: {
    color: 'black',
    flex: 1,
  },
});
