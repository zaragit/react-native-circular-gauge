import React from 'react';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  SharedValue,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useDerivedValue,
} from 'react-native-reanimated';
import { polar2Canvas } from 'react-native-redash';
import { Circle } from 'react-native-svg';
import { useGaugeContext } from './context/GaugeContext';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  theta: SharedValue<number>;
  fill?: string;
}

function Pointer({ theta, fill = '#E32F1E' }: Props) {
  const { R, CENTER, STROKE_WIDTH } = useGaugeContext();

  const endPosition = useDerivedValue(() =>
    polar2Canvas({ theta: theta.value, radius: R }, CENTER),
  );

  return (
    <AnimatedCircle
      animatedProps={useAnimatedProps(() => {
        const { x, y } = endPosition.value;
        return {
          cx: x,
          cy: y,
          r: STROKE_WIDTH / 2,
        };
      })}
      fill={fill}
    />
  );
}

export default Pointer;
