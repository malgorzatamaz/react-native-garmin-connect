import React, { useEffect, useState } from 'react';
import { StyleSheet, View, DeviceEventEmitter } from 'react-native';

import { PaperProvider } from 'react-native-paper';
import { init, destroy } from 'react-native-garmin-connect';
import { DevicesList } from './components/DevicesList';

export default function App() {
  const [isSdkReady, setIsSdkReady] = useState(false);
  const onSdkReady = (isReady: boolean) => {
    console.log('onSdkReady', isReady);
    setIsSdkReady(isReady);
  };

  const onError = (error: string) => {
    console.log('onError', error);
  };
  const onInfo = (info: string) => {
    console.log('onInfo', info);
  };

  useEffect(() => {
    DeviceEventEmitter.addListener('onSdkReady', onSdkReady);
    DeviceEventEmitter.addListener('onError', onError);
    DeviceEventEmitter.addListener('onInfo', onInfo);
    init();

    return () => destroy();
  }, []);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <DevicesList isSdkReady={isSdkReady} />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
