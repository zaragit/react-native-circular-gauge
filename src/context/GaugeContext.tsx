import React from 'react';

import { createContext, useContext } from 'react';
import { Vector } from 'react-native-redash';

interface GaugeContext {
  R: number;
  SIZE: number;
  STROKE_WIDTH: number;
  CENTER: Vector;
}

const GaugeContext = createContext<GaugeContext | null>(null);

export function useGaugeContext() {
  const context = useContext(GaugeContext);

  if (!context) {
    throw new Error('GaugeContext.Provider is not found.');
  }

  return context;
}

interface Props {
  size: number;
  r: number;
  strokeWidth: number;
  center: Vector;
  children: React.ReactNode;
}

export function GaugeContextProvider({
  r,
  size,
  strokeWidth,
  center,
  children,
}: Props) {
  return (
    <GaugeContext.Provider
      value={{ R: r, SIZE: size, STROKE_WIDTH: strokeWidth, CENTER: center }}
    >
      {children}
    </GaugeContext.Provider>
  );
}
