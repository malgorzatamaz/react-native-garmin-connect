import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Text } from 'react-native-paper';

import { useAngleValues } from './useAngleValues';
import { angleValuesAtom } from '../../state';
import { useAtomValue } from 'jotai';

const Icon = require('../../../assets/cyclist.gif');

export const AnimationView = () => {
  const angleValues = useAtomValue(angleValuesAtom);
  const angle = useMemo(() => {
    const average =
      angleValues.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      ) / angleValues.length;

    return average.toFixed(0);
  }, [angleValues]);

  const rotateValue = useSharedValue(0);
  const { width } = useWindowDimensions();
  const updateAngle = useCallback(
    (newValue: number) => {
      rotateValue.value = withTiming(newValue, {
        duration: 100,
        easing: Easing.linear,
      });
    },
    [rotateValue]
  );

  useAngleValues(updateAngle);

  const animatedStyles = useAnimatedStyle(() => {
    //clamp value
    const value = Math.min(Math.max(-80, rotateValue.value), 80);

    const height = width / 2;
    return {
      height: height,
      transform: [
        { translateY: height / 2 },
        { rotate: value + 'deg' },
        { translateY: -(height / 2) },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Animated.Image
          style={animatedStyles}
          source={Icon}
          resizeMode="contain"
        />
      </View>

      <Text variant="headlineMedium">
        {angleValues.length ? <>{angle} °</> : null}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  imageWrapper: {
    borderColor: 'black',
    borderBottomWidth: 5,
  },
});
