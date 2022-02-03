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
  useHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { canvas2Polar, PI, TAU } from 'react-native-redash';
import Svg, { Circle } from 'react-native-svg';
import { GaugeContextProvider } from './context/GaugeContext';
import Bar from './Bar';
import Gesture from './Gesture';
import Pointer from './Pointer';
import ScaleBoard from './ScaleBoard';

const normalize = (value: number) => {
  'worklet';
  const rest = value % TAU;
  return rest > 0 ? rest : TAU + rest;
};

const moveable = (
  startTheta: number,
  currentTheta: number,
  newTheta: number,
) => {
  'worklet';

  return (
    currentTheta > PI ||
    (currentTheta < startTheta
      ? newTheta < startTheta || newTheta > PI
      : newTheta > startTheta)
  );
};

interface Props {
  scale?: number;
  size: number;
  strokeWidth?: number;
  getPointerColor?: () => string;
  getBarColor?: () => string;
  onChange: (scale: number) => void;
}

function ScaleGauge({
  scale = 0,
  size,
  strokeWidth = 40,
  getBarColor,
  getPointerColor,
  onChange,
}: Props) {
  const halfSize = size / 2;
  const r = halfSize - strokeWidth;
  const center = { x: halfSize, y: halfSize };

  const scale2Theta = (scale: number) => {
    const degrees = 450 - 360 / (100 / scale);
    return degrees * (PI / 180);
  };

  const theta2Scale = (theta: number) => {
    'worklet';
    const degrees = 90 + (TAU - theta) * (180 / PI);
    return Math.round(degrees * (100 / 360));
  };

  const startTheta = useSharedValue(0.5 * PI);
  const theta = useSharedValue(scale2Theta(scale));

  const gestureTarget = useSharedValue<{
    currentTheta: SharedValue<number>;
  } | null>(null);

  const onGestureEventHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {}
  >({
    onActive: ({ x, y }) => {
      const { theta } = canvas2Polar({ x, y }, center);

      if (gestureTarget.value) {
        const { currentTheta } = gestureTarget.value;
        const newTheta = normalize(theta);

        if (moveable(startTheta.value, currentTheta.value, newTheta)) {
          currentTheta.value = newTheta;
        }

        runOnJS(onChange)(theta2Scale(currentTheta.value));
      }
    },
    onEnd: () => {
      gestureTarget.value = null;

      runOnJS(onChange)(theta2Scale(theta.value));
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

          <ScaleBoard showText={true} />

          <Bar
            startTheta={startTheta}
            endTheta={theta}
            clockwise={true}
            stroke={getBarColor && getBarColor()}
          />

          <Pointer theta={theta} fill={getPointerColor && getPointerColor()} />
        </Svg>
        <PanGestureHandler onGestureEvent={onGestureEventHandler}>
          <Animated.View style={StyleSheet.absoluteFill}>
            <Gesture
              prevTheta={theta}
              currentTheta={theta}
              nextTheta={theta}
              gestureTarget={gestureTarget}
            />
          </Animated.View>
        </PanGestureHandler>
      </View>
    </GaugeContextProvider>
  );
}

export default ScaleGauge;
