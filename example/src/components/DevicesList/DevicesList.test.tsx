import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react-native';
import * as connectModule from 'react-native-garmin-connect';
import React from 'react';
import { DevicesList } from './DevicesList';
import { NativeEventEmitter, type ViewStyle } from 'react-native';

jest.mock(
  'react-native-vector-icons/MaterialCommunityIcons',
  () => 'MaterialCommunityIcons'
);

jest.mock('react-native-paper', () => ({
  Button: () => 'Button',
  Text: () => 'Text',
}));

jest.mock('react-native-garmin-connect', () => {
  enum mockStatus {
    CONNECTED = 'CONNECTED',
    ONLINE = 'ONLINE',
    OFFLINE = 'OFFLINE',
  }

  return {
    Status: mockStatus,
    GarminConnect: { removeListeners: jest.fn(), addListener: jest.fn() },
    showDevicesList: jest.fn(),
    connectDevice: jest.fn(),
    getDevicesList: jest.fn(() => {
      return Promise.resolve([
        {
          id: 'Fenix_5s',
          model: 'Fenix',
          name: 'Fenix 5s',
          status: mockStatus.ONLINE,
        },
        {
          id: 'Edge_520',
          model: 'Edge',
          name: 'Edge 520',
          status: mockStatus.OFFLINE,
        },
      ]);
    }),
  };
});

describe('render of devices list', () => {
  test('render list with statuses', async () => {
    const connectedDeviceName = 'Fenix 5s';
    jest.spyOn(connectModule, 'getDevicesList');
    const { rerender } = render(<DevicesList isSdkReady={false} />);

    rerender(<DevicesList isSdkReady={true} />);
    await waitFor(() =>
      expect(connectModule.getDevicesList).toHaveBeenCalledTimes(1)
    );
    const devices = await screen.findAllByTestId('deviceListItem', {
      exact: false,
    });

    const connectedDevice = await screen.findByTestId(
      `deviceListItem_${connectedDeviceName}`
    );

    const connectedStatus =
      await within(connectedDevice).findByTestId('status');
    const style = connectedStatus.props.style.find(
      (styles: ViewStyle) => !!styles.backgroundColor
    );
    expect(devices).toHaveLength(2);
    expect(style.backgroundColor).toBe('green');
  }, 10000);

  test('connect to one of devices', async () => {
    const nativeEventEmitter = new NativeEventEmitter(
      connectModule.GarminConnect
    );
    const connectedDeviceName = 'Fenix 5s';
    jest.spyOn(connectModule, 'getDevicesList');
    const { rerender } = render(<DevicesList isSdkReady={false} />);
    await act(() =>
      nativeEventEmitter.emit('onDeviceStatusChanged', {
        name: connectedDeviceName,
        status: 'CONNECTED',
      })
    );

    rerender(<DevicesList isSdkReady={true} />);

    const connectedDevice = await screen.findByTestId(
      `deviceListItem_${connectedDeviceName}`
    );

    act(() => fireEvent(connectedDevice, 'onPress'));

    expect(connectModule.connectDevice).toHaveBeenCalledWith(
      'Fenix_5s',
      'Fenix',
      'Fenix 5s'
    );
  });

  test('handle connected to device', async () => {
    const nativeEventEmitter = new NativeEventEmitter(
      connectModule.GarminConnect
    );
    const connectedDeviceName = 'Fenix 5s';
    jest.spyOn(connectModule, 'getDevicesList');
    const { rerender } = render(<DevicesList isSdkReady={false} />);
    await act(() =>
      nativeEventEmitter.emit('onDeviceStatusChanged', {
        name: connectedDeviceName,
        status: 'CONNECTED',
      })
    );

    rerender(<DevicesList isSdkReady={true} />);
    const connectedIcon = await screen.findByTestId(`connectedIcon`);
    expect(connectedIcon).toBeDefined();
  });
});
