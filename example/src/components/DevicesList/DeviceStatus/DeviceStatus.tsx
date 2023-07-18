import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';

import { Status } from '../../../types';

type Props = { status: Status };

export const DeviceStatus = memo(({ status }: Props) => {
  return (
    <View
      testID="status"
      style={[
        styles.dot,
        status === Status.ONLINE ? styles.dotOnline : styles.dotOffline,
      ]}
    />
  );
});

const styles = StyleSheet.create({
  dot: { height: 20, width: 20, borderRadius: 20 },
  dotOnline: { backgroundColor: 'green' },
  dotOffline: { backgroundColor: 'red' },
});
