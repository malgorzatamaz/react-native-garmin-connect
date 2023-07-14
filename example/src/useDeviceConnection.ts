import { init, destroy } from 'react-native-garmin-connect';
import { DeviceEventEmitter } from 'react-native';
import { useCallback, useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';

import { Message, MessageType } from './types';
import { saveSnapshot } from './db/actions';
import { angleValuesAtom, isSdkReadyAtom } from './state';

export default function useDeviceConnection() {
  const [isSdkReady, setIsSdkReady] = useAtom(isSdkReadyAtom);
  const setAngleValues = useSetAtom(angleValuesAtom);

  const onSdkReady = useCallback(
    (isReady: boolean) => {
      setIsSdkReady(isReady);
    },
    [setIsSdkReady]
  );

  const onError = (error: string) => {
    console.log('onError', error);
  };
  const onInfo = (info: string) => {
    console.log('onInfo', info);
  };

  const onMessage = useCallback(
    (message: Message) => {
      if (message.type === MessageType.ALL) {
        const { angle, ...data } = JSON.parse(message.payload);
        saveSnapshot(data);
        setAngleValues(JSON.parse(angle));
      }
    },
    [setAngleValues]
  );

  useEffect(() => {
    if (!isSdkReady) init();
  }, [isSdkReady]);

  useEffect(() => {
    DeviceEventEmitter.addListener('onSdkReady', onSdkReady);
    DeviceEventEmitter.addListener('onError', onError);
    DeviceEventEmitter.addListener('onInfo', onInfo);
    DeviceEventEmitter.addListener('onMessage', onMessage);

    return () => {
      destroy();
      DeviceEventEmitter.removeAllListeners();
    };
  }, [onMessage, onSdkReady]);
}
