import React, { useEffect, useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';
import {
  Chart,
  Line,
  HorizontalAxis,
  VerticalAxis,
  Tooltip,
} from 'react-native-responsive-linechart';
import type { LineHandle } from 'react-native-responsive-linechart/lib/Line';

import type { DataSnapshot } from '../../types';
import { getAllSnapshots } from '../../db/actions';
import usePrev from '../../hooks/usePrev';

type ChartValues = { x: number; y: number };

type Props = { selectedIndex?: number };

export const Charts = ({ selectedIndex }: Props) => {
  const refSpeed = useRef<LineHandle | null>(null);
  const refAngle = useRef<LineHandle | null>(null);
  const prevSelectedIndex = usePrev(selectedIndex);

  const snapshots = useMemo(() => getAllSnapshots(), []);
  const speed = useMemo<ChartValues[]>(() => {
    if (snapshots) {
      return snapshots.map((data: DataSnapshot) => ({
        x: data.speed,
        y: data.speed,
      }));
    }

    return [];
  }, [snapshots]);

  const angle = useMemo(() => {
    if (snapshots) {
      return snapshots.map((data: DataSnapshot) => ({
        x: data.time,
        y: data.angle,
      }));
    }

    return [];
  }, [snapshots]);

  useEffect(() => {
    if (!!selectedIndex && selectedIndex !== prevSelectedIndex) {
      refSpeed.current?.setTooltipIndex(selectedIndex);
      refAngle.current?.setTooltipIndex(selectedIndex);
    }
  }, [prevSelectedIndex, selectedIndex]);

  return (
    <Chart
      style={styles.container}
      padding={{ left: 40, bottom: 20, right: 20, top: 20 }}
      xDomain={{ min: 1, max: speed.length }}
      yDomain={{ min: 0, max: 90 }}
    >
      <VerticalAxis
        tickCount={11}
        theme={{ labels: { formatter: (v) => v.toFixed(2) } }}
      />

      <HorizontalAxis
        tickCount={5}
        theme={{
          labels: {
            formatter: (seconds) =>
              new Date(1000 * seconds).toISOString().slice(14, 19),
          },
        }}
      />
      {speed.length ? (
        <Line
          ref={refSpeed}
          data={speed}
          tooltipComponent={<Tooltip />}
          theme={{
            stroke: {
              color: '#ffa502',
              width: 5,
            },
          }}
        />
      ) : null}
      {angle.length ? (
        <Line
          ref={refAngle}
          data={angle}
          tooltipComponent={<Tooltip />}
          theme={{
            stroke: { color: '#eb4034', width: 5 },
            scatter: { default: { width: 4, height: 4, rx: 2 } },
          }}
        />
      ) : null}
    </Chart>
  );
};

const styles = StyleSheet.create({
  container: { height: 200, width: '100%' },
});
