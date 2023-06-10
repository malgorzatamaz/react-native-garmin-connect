import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import { Map } from '../../components/Map';
import { Charts } from '../../components/Charts';
import { deleteAllSnapshots } from '../../db/actions';

export const ChartView = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();
  const onPointPress = useCallback((index) => {
    setSelectedIndex(index);
  }, []);

  const clearData = () => {
    deleteAllSnapshots();
  };

  return (
    <View style={styles.container}>
      <Charts selectedIndex={selectedIndex} />
      <Map selectedIndex={selectedIndex} onPointPress={onPointPress} />

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
