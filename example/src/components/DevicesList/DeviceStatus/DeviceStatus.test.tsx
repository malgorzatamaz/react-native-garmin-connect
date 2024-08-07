import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { Status } from 'react-native-garmin-connect';
import { type ViewStyle } from 'react-native';

import { DeviceStatus } from './DeviceStatus';

jest.mock('react-native-garmin-connect', () => {
  enum mockStatus {
    CONNECTED = 'CONNECTED',
    ONLINE = 'ONLINE',
    OFFLINE = 'OFFLINE',
  }

  return {
    Status: mockStatus,
  };
});

test('status dot has green color', async () => {
  render(<DeviceStatus status={Status.ONLINE} />);
  const deviceStatusOutput = await screen.findByTestId('status');
  const style = deviceStatusOutput.props.style.find(
    (styles: ViewStyle) => !!styles.backgroundColor
  );

  expect(style.backgroundColor).toBe('green');
});

test('status dot has red color', async () => {
  render(<DeviceStatus status={Status.OFFLINE} />);
  const deviceStatusOutput = await screen.findByTestId('status');
  const style = deviceStatusOutput.props.style.find(
    (styles: ViewStyle) => !!styles.backgroundColor
  );

  expect(style.backgroundColor).toBe('red');
});
