import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Chart,
  HorizontalAxis,
  VerticalAxis,
} from 'react-native-responsive-linechart';

import { SpeedLine } from './SpeedLine';
import { AngleLine } from './AngleLine';
import { horizontalTheme, verticalTheme } from './utils';
import type { DataSnapshotResult } from '../../db/actions';

type Props = { selectedIndex?: number; snapshots?: DataSnapshotResult };

export const Charts = ({ selectedIndex, snapshots }: Props) => {
  if (!snapshots) return <View style={styles.container} />;

  return (
    <Chart
      style={styles.container}
      padding={{ left: 40, bottom: 20, right: 20, top: 20 }}
      xDomain={{ min: 1, max: snapshots.length }}
      yDomain={{ min: 0, max: 90 }}
    >
      <VerticalAxis tickCount={11} theme={verticalTheme} />
      <HorizontalAxis tickCount={5} theme={horizontalTheme} />
      <AngleLine snapshots={snapshots} selectedIndex={selectedIndex} />
      <SpeedLine snapshots={snapshots} selectedIndex={selectedIndex} />
    </Chart>
  );
};

const styles = StyleSheet.create({
  container: { height: 200, width: '100%' },
});
