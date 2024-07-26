import {
  initialize,
  destroy,
  // showDevicesList,
} from 'react-native-garmin-connect';
import { useCallback, useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';

import { type Message, MessageType } from '../types';
import { saveSnapshot } from '../db/actions';
import { angleValuesAtom, isSdkReadyAtom } from '../state';
import useListeners from './useListeners';
import { urlSchema } from '../constants';

export default function useDeviceConnection() {
  const [isSdkReady, setIsSdkReady] = useAtom(isSdkReadyAtom);
  const setAngleValues = useSetAtom(angleValuesAtom);
  const { addListener } = useListeners();

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

  console.log('isReady', isSdkReady);

  useEffect(() => {
    if (!isSdkReady) {
      initialize(urlSchema);
      // deleteAllSnapshots();
    }
  }, [isSdkReady, onSdkReady]);

  useEffect(() => {
    const onSdkReadyListener = addListener('onSdkReady', onSdkReady);
    const onErrorListener = addListener('onError', onError);
    const onInfoListener = addListener('onInfo', onInfo);
    const onMessageListener = addListener('onMessage', onMessage);

    return () => {
      destroy();
      onErrorListener.remove();
      onSdkReadyListener.remove();
      onInfoListener.remove();
      onMessageListener.remove();
    };
  }, [addListener, onMessage, onSdkReady]);
}
