import React from 'react';
import { polar2Canvas, TAU } from 'react-native-redash';
import { G, Line } from 'react-native-svg';
import { useGaugeContext } from '../context/GaugeContext';

function ScaleBoard() {
  const { R, STROKE_WIDTH, CENTER } = useGaugeContext();

  const vector = (theta: number, distance: number) => {
    return polar2Canvas(
      {
        theta: theta,
        radius: R - STROKE_WIDTH / 2 - distance,
      },
      CENTER,
    );
  };

  return (
    <>
      {new Array(20).fill(0).map((_, i) => {
        const theta = (i * TAU) / 20;

        const v1 = vector(theta, 5);
        const v2 = vector(theta, 15);

        return (
          <G key={i}>
            <Line
              x1={v1.x}
              y1={v1.y}
              x2={v2.x}
              y2={v2.y}
              stroke={'#bdbdbd'}
              strokeWidth={2}
              strokeLinecap="round"
            />
            {new Array(4).fill(0).map((_, j) => {
              const alpha = theta + (j + 1) * (TAU / 20 / 5);

              const v1 = vector(alpha, 5);
              const v2 = vector(alpha, 10);

              return (
                <Line
                  key={j}
                  x1={v1.x}
                  y1={v1.y}
                  x2={v2.x}
                  y2={v2.y}
                  stroke={'#bdbdbd'}
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              );
            })}
          </G>
        );
      })}
    </>
  );
}

export default ScaleBoard;
