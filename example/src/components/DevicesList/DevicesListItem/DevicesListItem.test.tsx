import { render, screen } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';

import { DevicesListItem } from './DevicesListItem';
import React from 'react';
import { Status, type Device } from 'react-native-garmin-connect';

test('examples of some things', async () => {
  const expectedDeviceName = 'Garmin Fenix 5s';
  const device = { name: expectedDeviceName, status: Status.CONNECTED };
  render(<DevicesListItem isConnected={false} item={device as Device} />);
  const deviceNameOutput = await screen.findByTestId('name');
  expect(deviceNameOutput).toHaveTextContent(expectedDeviceName);
});
