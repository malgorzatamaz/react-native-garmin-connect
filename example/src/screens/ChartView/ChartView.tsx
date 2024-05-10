import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
// import { Button } from 'react-native-paper';

import { Map } from '../../components/Map';
import { Charts } from '../../components/Charts';
import { type DataSnapshotResult } from '../../db/actions';
import mockData from '../../mocks/mockData';

export const ChartView = () => {
  const [snapshots] = useState<DataSnapshotResult>(mockData as any);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();

  // const getSnapshots = useCallback(() => {
  //   setSnapshots(mockData);
  // }, []);

  // useEffect(() => {
  //   getSnapshots();
  // }, [getSnapshots]);

  const onPointPress = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  // const clearData = () => {
  //   // getSnapshots();
  // };

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
