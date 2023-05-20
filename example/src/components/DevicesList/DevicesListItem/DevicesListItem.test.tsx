import { render, screen } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';

import { DevicesListItem } from './DevicesListItem';
import React from 'react';
import { Status } from '../../../types';

test('examples of some things', async () => {
  const expectedDeviceName = 'Garmin Fenix 5s';
  const device = { name: expectedDeviceName, status: Status.CONNECTED };
  render(<DevicesListItem item={device} />);
  const deviceNameOutput = await screen.findByTestId('name');
  expect(deviceNameOutput).toHaveTextContent(expectedDeviceName);
});
