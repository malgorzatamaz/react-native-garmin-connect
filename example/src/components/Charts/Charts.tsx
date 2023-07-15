import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import {
  Chart,
  HorizontalAxis,
  VerticalAxis,
} from 'react-native-responsive-linechart';

import { getAllSnapshots } from '../../db/actions';
import { SpeedLine } from './SpeedLine';
import { AngleLine } from './AngleLine';
import { horizontalTheme, verticalTheme } from './utils';

type Props = { selectedIndex?: number };

export const Charts = ({ selectedIndex }: Props) => {
  const snapshots = useMemo(() => getAllSnapshots(), []);

  return (
    <Chart
      style={styles.container}
      padding={{ left: 40, bottom: 20, right: 20, top: 20 }}
      xDomain={{ min: 1, max: snapshots.length }}
      yDomain={{ min: 0, max: 90 }}
    >
      <VerticalAxis tickCount={11} theme={verticalTheme} />
      <HorizontalAxis tickCount={5} theme={horizontalTheme} />
      <SpeedLine snapshots={snapshots} selectedIndex={selectedIndex} />
      <AngleLine snapshots={snapshots} selectedIndex={selectedIndex} />
    </Chart>
  );
};

const styles = StyleSheet.create({
  container: { height: 200, width: '100%' },
});
