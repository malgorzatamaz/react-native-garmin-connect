import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import { Map } from '../../components/Map';
import { Charts } from '../../components/Charts';
import {
  type DataSnapshotResult,
  deleteAllSnapshots,
  getAllSnapshots,
} from '../../db/actions';

export const ChartView = () => {
  const [snapshots, setSnapshots] = useState<DataSnapshotResult>();
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();

  const getSnapshots = useCallback(() => {
    setSnapshots(getAllSnapshots());
  }, []);

  useEffect(() => {
    getSnapshots();
  }, [getSnapshots]);

  const onPointPress = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const clearData = () => {
    deleteAllSnapshots();
  };

  return (
    <View style={styles.container}>
      <Charts selectedIndex={selectedIndex} snapshots={snapshots} />
      <Map
        selectedIndex={selectedIndex}
        snapshots={snapshots}
        onPointPress={onPointPress}
      />

      <Button mode="contained" style={styles.button} onPress={getSnapshots}>
        Refresh
      </Button>
      <Button mode="contained" style={styles.button} onPress={clearData}>
        Clear data
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  button: {
    margin: 30,
  },
});
