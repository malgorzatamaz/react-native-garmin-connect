import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import { Map } from '../../components/Map';
import { Charts } from '../../components/Charts';
import {
  DataSnapshotResult,
  deleteAllSnapshots,
  getAllSnapshots,
} from '../../db/actions';
import mockData from '../../mocks/mockData';

export const ChartView = () => {
  const [snapshots, setSnapshots] = useState<DataSnapshotResult>(mockData);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();

  const getSnapshots = useCallback(() => {
    setSnapshots(mockData);
  }, []);

  // useEffect(() => {
  //   getSnapshots();
  // }, [getSnapshots]);

  const onPointPress = useCallback((index) => {
    setSelectedIndex(index);
  }, []);

  const clearData = () => {
    // getSnapshots();
  };

  console.log('snapshots', snapshots);

  return (
    <View style={styles.container}>
      <Charts selectedIndex={selectedIndex} snapshots={snapshots} />
      <Map
        selectedIndex={selectedIndex}
        snapshots={snapshots}
        onPointPress={onPointPress}
      />

      {/* <Button mode="contained" style={styles.button} onPress={getSnapshots}>
        Refresh
      </Button>
      <Button mode="contained" style={styles.button} onPress={clearData}>
        Clear data
      </Button> */}
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
