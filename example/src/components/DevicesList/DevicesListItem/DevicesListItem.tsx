import React, { memo, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connectDevice } from 'react-native-garmin-connect';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Device, Status } from '../../../types';
import { DeviceStatus } from '../DeviceStatus';

type Props = { item: Device; isConnected: boolean };

export const DevicesListItem = memo(({ item, isConnected }: Props) => {
  console.log(isConnected);

  const onPress = useCallback(() => {
    connectDevice(item.name)
      .then(() => {
        console.log('connected');
      })
      .catch(() => {
        console.log('not connected');
      });
  }, [item.name]);

  return (
    <TouchableOpacity
      onPress={onPress}
      testID={`deviceListItem_${item.name}`}
      style={[
        styles.container,
        item.status === Status.DISCONNECTED ? styles.disconnected : {},
      ]}
      disabled={item.status === Status.DISCONNECTED}
    >
      <View
        style={[
          styles.container,
          item.status === Status.DISCONNECTED ? styles.disconnected : {},
        ]}
      >
        <Text style={styles.text} testID="name">
          {item.name}
        </Text>
        {isConnected ? (
          <MaterialCommunityIcons name="bluetooth" color="black" size={26} />
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
    height: 40,
    width: '100%',
    padding: 10,
  },
  disconnected: { backgroundColor: '#E7E7E7' },
  text: {
    color: 'black',
    flex: 1,
  },
});
