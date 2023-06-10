import React from 'react';
import { View, StyleSheet } from 'react-native';

import { DevicesList } from '../../components/DevicesList';
import { isSdkReadyAtom } from '../../state';
import { useAtom } from 'jotai';

export const DeviceManager = () => {
  const [isSdkReady] = useAtom(isSdkReadyAtom);

  return (
    <View style={styles.container}>
      <DevicesList isSdkReady={isSdkReady} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});
