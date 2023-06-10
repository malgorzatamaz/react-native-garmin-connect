import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useAtomValue } from 'jotai';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Observable } from 'rxjs';

import { angleValuesAtom } from '../../state';
const Icon = require('../../../assets/cyclist.gif');

export const AnimationView = () => {
  const rotateValue = useSharedValue(0);
  const { width } = useWindowDimensions();
  const values = useAtomValue(angleValuesAtom);

  const updateAngle = useCallback(
    (newValue: number) => {
      rotateValue.value = withTiming(newValue, {
        duration: 100,
        easing: Easing.linear,
      });
    },
    [rotateValue]
  );

  useEffect(() => {
    const array = new Observable<number>(function (observer) {
      const valueArray = values;
      if (!valueArray || !valueArray.length) return;

      let i = 0;
      const interval = setInterval(() => {
        if (i < valueArray.length) {
          const value = valueArray[i];
          if (value) {
            observer.next(parseInt(value.toString(), 10));
            i++;
          }
        } else {
          clearInterval(interval);
        }
      }, 100);
    });

    array.subscribe((observer) => updateAngle(observer));
  }, [updateAngle, values]);

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
