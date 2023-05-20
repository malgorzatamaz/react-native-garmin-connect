import { render, screen } from '@testing-library/react-native';
import React from 'react';

import { Status } from '../../../types';
import { DeviceStatus } from './DeviceStatus';
import type { ViewStyle } from 'react-native';

test('status dot has green color', async () => {
  render(<DeviceStatus status={Status.CONNECTED} />);
  const deviceStatusOutput = await screen.findByTestId('status');
  const style = deviceStatusOutput.props.style.find(
    (styles: ViewStyle) => !!styles.backgroundColor
  );

  expect(style.backgroundColor).toBe('green');
});

test('status dot has red color', async () => {
  render(<DeviceStatus status={Status.DISCONNECTED} />);
  const deviceStatusOutput = await screen.findByTestId('status');
  const style = deviceStatusOutput.props.style.find(
    (styles: ViewStyle) => !!styles.backgroundColor
  );

  expect(style.backgroundColor).toBe('red');
});
