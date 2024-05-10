import React, { useCallback, useMemo } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { StyleSheet } from 'react-native';

import { type DataSnapshotResult } from '../../db/actions';
import type { DataSnapshot, Coordinates } from '../../types';

const location = require(`../../../assets/location.png`);
const locationSelected = require(`../../../assets/location_selected.png`);

type Props = {
  snapshots?: DataSnapshotResult;
  selectedIndex?: number;
  onPointPress: (index: number) => void;
};

export const Map = ({ onPointPress, selectedIndex, snapshots }: Props) => {
  const coordinates = useMemo<Coordinates[]>(() => {
    if (snapshots) {
      return snapshots
        .filter((data) => !!data.lng)
        .map((data: DataSnapshot) => ({
          latitude: data.lat,
          longitude: data.lng,
          time: data.time,
        }));
    }
    return [];
  }, [snapshots]);

  const onPress = useCallback(
    (index: number) => {
      onPointPress(index);
    },
    [onPointPress]
  );

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: 49.67005,
        longitude: 19.224191,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      <Polyline
        coordinates={coordinates}
        strokeColor="rgba(104,156,229,0.50)"
        strokeWidth={6}
      />
      {coordinates.map((cord, index) => {
        const uri = index === selectedIndex ? locationSelected : location;
        return (
          <Marker
            key={`${cord.time}-${cord.latitude}-${cord.longitude}`}
            coordinate={cord}
            onPress={() => onPress(index)}
            icon={uri}
          />
        );
      })}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: '100%',
  },
});
