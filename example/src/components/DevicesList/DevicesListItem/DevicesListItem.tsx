import type { Device } from 'example/src/types';
import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DeviceStatus } from '../DeviceStatus';

type Props = { item: Device };

export const DevicesListItem = memo(({ item }: Props) => {
  return (
    <View testID={`deviceListItem_${item.name}`} style={styles.container}>
      <Text testID="name">{item.name}</Text>
      <DeviceStatus status={item.status} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
