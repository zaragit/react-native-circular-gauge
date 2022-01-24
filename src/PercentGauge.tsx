import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedGestureHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { canvas2Polar, PI, TAU } from 'react-native-redash';
import Svg, { Circle } from 'react-native-svg';
import { GaugeContextProvider } from '../context/GaugeContext';
import Bar from './Bar';
import Gesture from './Gesture';
import Pointer from './Pointer';
import ScaleBoard from './ScaleBoard';

const normalize = (value: number) => {
  'worklet';
  const rest = value % TAU;
  return rest > 0 ? rest : TAU + rest;
};

const moveable = (start: number, end: number, current: number) => {
  'worklet';
  return start > end
    ? current > start || end > current
    : current < end && current >= start;
};

const theta2Percent = (theta: number, start = 0) => {
  'worklet';
  const degrees = normalize(theta - start) * (180 / PI);
  return (degrees / 360) * 100;
};

interface Props {
  size: number;
  percent: number[];
  showScale?: boolean;
  strokeWidth?: number;
  getPointerColor?: (index: number) => string;
  getBarColor?: (index: number) => string;
  onChange: (percent: number[]) => void;
}

function PercentGauge({
  size,
  percent,
  showScale = false,
  strokeWidth = 40,
  getPointerColor,
  getBarColor,
  onChange,
}: Props) {
  const halfSize = size / 2;
  const r = halfSize - strokeWidth;
  const center = { x: halfSize, y: halfSize };

  const percent2Theta = (percent: number, distance = 0) => {
    const theta = TAU * (percent / 100);
    return theta + distance;
  };

  const thetas = percent.reduce(
    (acc, cur, index) => [
      ...acc,
      useSharedValue(percent2Theta(cur, acc[index - 1]?.value)),
    ],
    [] as SharedValue<number>[],
  );

  const gestureTarget = useSharedValue<{
    prevTheta: SharedValue<number>;
    currentTheta: SharedValue<number>;
    nextTheta: SharedValue<number>;
  } | null>(null);

  const onGestureEventHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { offset: number }
  >({
    onStart: ({ x, y }, context) => {
      const { theta } = canvas2Polar({ x, y }, center);
      context.offset = theta;
    },
    onActive: ({ x, y }, context) => {
      const { theta } = canvas2Polar({ x, y }, center);

      if (gestureTarget.value) {
        const { prevTheta, currentTheta, nextTheta } = gestureTarget.value;
        const delta = normalize(theta);

        if (moveable(currentTheta.value, nextTheta.value, delta)) {
          currentTheta.value = delta;
        }

        if (moveable(prevTheta.value, currentTheta.value, delta)) {
          currentTheta.value = delta;
        }

        context.offset = currentTheta.value;
      } else {
        const delta = theta - context.offset;
        thetas.forEach((t) => (t.value = normalize(t.value + delta)));
        context.offset = theta;
      }
    },
    onEnd: () => {
      gestureTarget.value = null;

      runOnJS(onChange)(
        thetas.reduce((acc, cur, index, arr) => {
          const prev = arr[index - 1] || arr[arr.length - 1];
          acc.push(theta2Percent(cur.value, prev.value));
          return acc;
        }, [] as number[]),
      );
    },
  });

  return (
    <GaugeContextProvider
      size={size}
      r={r}
      strokeWidth={strokeWidth}
      center={center}
    >
      <View style={{ position: 'relative', width: size, height: size }}>
        <Svg width={size} height={size}>
          <Circle
            cx={center.x}
            cy={center.y}
            stroke={'#bdbdbd'}
            strokeWidth={strokeWidth}
            r={r}
          />

          {showScale && <ScaleBoard />}

          {thetas.reduce((acc, cur, index, arr) => {
            const prev = arr[index - 1] || arr[arr.length - 1];
            acc.push(
              <Bar
                key={index}
                startTheta={prev}
                endTheta={cur}
                stroke={getBarColor && getBarColor(index)}
              />,
            );
            return acc;
          }, [] as React.ReactNode[])}

          {thetas.map((theta, index) => (
            <Pointer
              key={index}
              theta={theta}
              fill={getPointerColor && getPointerColor(index)}
            />
          ))}
        </Svg>
        <PanGestureHandler onGestureEvent={onGestureEventHandler}>
          <Animated.View style={StyleSheet.absoluteFill}>
            {thetas.reduce((acc, cur, index, arr) => {
              const prev = arr[index - 1] || arr[arr.length - 1];
              const next = arr[index + 1] || arr[0];
              acc.push(
                <Gesture
                  key={index}
                  prevTheta={prev}
                  currentTheta={cur}
                  nextTheta={next}
                  gestureTarget={gestureTarget}
                />,
              );
              return acc;
            }, [] as React.ReactNode[])}
          </Animated.View>
        </PanGestureHandler>
      </View>
    </GaugeContextProvider>
  );
}

export default PercentGauge;
