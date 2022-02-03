import React from 'react';
import Animated, {
  SharedValue,
  useAnimatedProps,
  useDerivedValue,
} from 'react-native-reanimated';
import { PI, polar2Canvas, TAU } from 'react-native-redash';
import { Path } from 'react-native-svg';
import { useGaugeContext } from './context/GaugeContext';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface Props {
  startTheta: SharedValue<number>;
  endTheta: SharedValue<number>;
  stroke?: string;
  clockwise?: boolean;
}

function Bar({
  startTheta,
  endTheta,
  stroke = '#EB5648',
  clockwise = false,
}: Props) {
  const { R, CENTER, STROKE_WIDTH } = useGaugeContext();

  const position = (theta: SharedValue<number>) => {
    'worklet';
    return () => {
      'worklet';
      return polar2Canvas({ theta: theta.value, radius: R }, CENTER);
    };
  };

  const thetaBetweenStartAndEnd = (start: number, end: number) => {
    'worklet';
    return start > end ? end + (TAU - start) : end - start;
  };

  const arc = (x: number, y: number, large = false) => {
    'worklet';
    return `A ${R} ${R} 0 ${large ? '1' : '0'} ${
      clockwise ? '1' : '0'
    } ${x} ${y}`;
  };

  const startPosition = useDerivedValue(position(startTheta), [startTheta]);
  const endPosition = useDerivedValue(position(endTheta), [endTheta]);

  return (
    <AnimatedPath
      stroke={stroke}
      strokeWidth={STROKE_WIDTH}
      animatedProps={useAnimatedProps(() => {
        const { x: startX, y: startY } = startPosition.value;
        const { x: endX, y: endY } = endPosition.value;
        const theta = thetaBetweenStartAndEnd(startTheta.value, endTheta.value);

        return {
          d: `M ${startX} ${startY} ${arc(
            endX,
            endY,
            clockwise ? theta < PI : theta > PI,
          )}`,
        };
      })}
    />
  );
}

export default Bar;
