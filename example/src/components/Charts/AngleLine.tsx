import React, { useEffect, useMemo, useRef } from 'react';
import { Line, Tooltip } from 'react-native-responsive-linechart';
import type { LineHandle } from 'react-native-responsive-linechart/lib/Line';

import usePrev from '../../hooks/usePrev';
import type { DataSnapshotResult } from '../../db/actions';
import { angleTheme } from './utils';

type Props = { selectedIndex?: number; snapshots: DataSnapshotResult };

export const AngleLine = ({ selectedIndex, snapshots }: Props) => {
  const refAngle = useRef<LineHandle | null>(null);
  const prevSelectedIndex = usePrev(selectedIndex);

  const angleData = useMemo(() => {
    if (snapshots) {
      return snapshots.map(
        ({ time, angle }: { time: number; angle: number }) => ({
          x: time,
          y: parseInt(angle.toFixed(0), 10),
        })
      );
    }

    return [];
  }, [snapshots]);

  useEffect(() => {
    if (!!selectedIndex && selectedIndex !== prevSelectedIndex) {
      refAngle.current?.setTooltipIndex(selectedIndex);
    }
  }, [prevSelectedIndex, selectedIndex]);

  return angleData.length ? (
    <Line
      ref={refAngle}
      data={angleData}
      tooltipComponent={<Tooltip />}
      theme={angleTheme}
    />
  ) : null;
};
