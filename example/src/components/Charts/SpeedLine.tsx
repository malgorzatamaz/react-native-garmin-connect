import React, { useEffect, useMemo, useRef } from 'react';
import { Line, Tooltip } from 'react-native-responsive-linechart';
import type { LineHandle } from 'react-native-responsive-linechart/lib/Line';

import usePrev from '../../hooks/usePrev';
import type { DataSnapshotResult } from '../../db/actions';
import { speedTheme } from './utils';

type ChartValues = { x: number; y: number };

type Props = { selectedIndex?: number; snapshots: DataSnapshotResult };

export const SpeedLine = ({ selectedIndex, snapshots }: Props) => {
  const refSpeed = useRef<LineHandle | null>(null);
  const prevSelectedIndex = usePrev(selectedIndex);

  const speedData = useMemo<ChartValues[]>(() => {
    if (snapshots) {
      return snapshots.map(({ time, speed }) => ({
        x: time,
        y: parseInt(speed.toFixed(0), 10),
      }));
    }

    return [];
  }, [snapshots]);

  useEffect(() => {
    if (!!selectedIndex && selectedIndex !== prevSelectedIndex) {
      refSpeed.current?.setTooltipIndex(selectedIndex);
    }
  }, [prevSelectedIndex, selectedIndex]);

  return speedData.length ? (
    <Line
      ref={refSpeed}
      data={speedData}
      tooltipComponent={<Tooltip />}
      theme={speedTheme}
    />
  ) : null;
};
