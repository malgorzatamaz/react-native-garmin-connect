import { render, screen } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';

import { DevicesListItem } from './DevicesListItem';
import React from 'react';
import { Status } from 'react-native-garmin-connect';

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
  };
});

jest.mock(
  'react-native-vector-icons/MaterialCommunityIcons',
  () => 'MaterialCommunityIcons'
);

test('render of device item', async () => {
  const expectedDeviceName = 'Garmin Fenix 5s';
  const device = {
    id: expectedDeviceName,
    model: 'Fenix',
    name: expectedDeviceName,
    status: Status.CONNECTED,
  };
  render(<DevicesListItem isConnected={false} item={device} />);
  const deviceNameOutput = await screen.findByTestId('name');
  expect(deviceNameOutput).toHaveTextContent(expectedDeviceName);
});
