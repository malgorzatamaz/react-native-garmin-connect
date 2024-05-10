import { render, screen, waitFor, within } from '@testing-library/react-native';
import * as connectModule from 'react-native-garmin-connect';
import React from 'react';
import { DevicesList } from './DevicesList';
import type { ViewStyle } from 'react-native';

const knownDevices = ['Fenix 5s', 'Edge 520'];
const connectedDevices = ['Fenix 5s'];

jest.mock('react-native-garmin-connect', () => ({
  getKnownDeviceList: jest.fn(() => Promise.resolve(knownDevices)),
  getConnectedDeviceList: jest.fn(() => Promise.resolve(connectedDevices)),
}));

test('render of devices list', async () => {
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

  const connectedStatus = await within(connectedDevice).findByTestId('status');
  const style = connectedStatus.props.style.find(
    (styles: ViewStyle) => !!styles.backgroundColor
  );
  expect(devices).toHaveLength(2);
  expect(style.backgroundColor).toBe('green');
});
