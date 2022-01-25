import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  SharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import { canvas2Polar, polar2Canvas, TAU, Vector } from 'react-native-redash';
import { useGaugeContext } from '../context/GaugeContext';

interface Props {
  prevTheta?: SharedValue<number>;
  currentTheta: SharedValue<number>;
  nextTheta?: SharedValue<number>;
  gestureTarget: SharedValue<{
    prevTheta?: SharedValue<number>;
    currentTheta: SharedValue<number>;
    nextTheta?: SharedValue<number>;
  } | null>;
}

function Gesture({ prevTheta, currentTheta, nextTheta, gestureTarget }: Props) {
  const { R, CENTER, STROKE_WIDTH } = useGaugeContext();

  const endPosition = useDerivedValue(
    () => polar2Canvas({ theta: currentTheta.value, radius: R }, CENTER),
    [currentTheta],
  );

  return (
    <Pressable
      onPressIn={() => {
        gestureTarget.value = {
          prevTheta,
          currentTheta,
          nextTheta,
        };
      }}
    >
      <Animated.View
        style={useAnimatedStyle(() => ({
          position: 'absolute',
          width: STROKE_WIDTH,
          height: STROKE_WIDTH,
          left: endPosition.value.x - STROKE_WIDTH / 2,
          top: endPosition.value.y - STROKE_WIDTH / 2,
        }))}
      />
    </Pressable>
  );
}

export default Gesture;
