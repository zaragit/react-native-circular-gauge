import 'react-native-reanimated';
import React, { useState } from 'react';
import { Button, Dimensions, StyleSheet, Text, View } from 'react-native';
import PercentGauge from './src/PercentGauge';
import ScaleGauge from './src/ScaleGauge';

const PADDING = 24;
const WINDOW_WIDTH = Dimensions.get('window').width;
const MACRO_CONTAINER_WIDTH = WINDOW_WIDTH - PADDING * 2;
const CIRCLE_SIZE = MACRO_CONTAINER_WIDTH - 60;

const RED = '#FF8C80';
const BLUE = '#61E0CC';
const YELLOW = '#FFE08A';

const LIGHT_RED = '#FFB8B1';
const LIGHT_BLUE = '#A3E1DC';
const LIGHT_YELLOW = '#FAEAC2';

const barColors = [LIGHT_RED, LIGHT_BLUE, LIGHT_YELLOW];
const pointerColors = [RED, BLUE, YELLOW];

export default function App() {
  const [size, setSize] = useState(CIRCLE_SIZE);
  const [percents, setPercents] = useState([30, 50, 20]);
  const [scale, setScale] = useState(40);
  const test = false;

  const [p1, p2, p3] = percents;

  return (
    <View style={styles.container}>
      {test && (
        <>
          <View
            style={{
              position: 'absolute',
              top: 50,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Button title="Size Up" onPress={() => setSize(size + 10)} />
            <Text>{size}</Text>
            <Button title="Size Down" onPress={() => setSize(size - 10)} />
          </View>
        </>
      )}
      <Text style={styles.title}>Macronutrients</Text>
      <Text style={styles.subTitle}>Protein, Fats, Carbs</Text>
      <View style={styles.canvas}>
        <View style={styles.percentageBox}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.percentage}>Fats</Text>
            <Text>{p1}%</Text>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.percentage}>Carbs</Text>
            <Text>{p2}%</Text>
          </View>
        </View>
        {/* <PercentGauge
          size={CIRCLE_SIZE}
          showScale={true}
          percent={percents}
          getBarColor={(index) => barColors[index]}
          getPointerColor={(index) => pointerColors[index]}
          onChange={(percents: number[]) => {
            setPercents(percents.map((percent) => Math.round(percent)));
          }}
        /> */}
        <ScaleGauge
          size={CIRCLE_SIZE}
          scale={scale}
          onChange={(scale) => setScale(scale)}
          getBarColor={() => barColors[1]}
          getPointerColor={() => pointerColors[1]}
        />
        <View style={styles.percentageBox}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.percentage}>Protein</Text>
            <Text>{p3}%</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: PADDING,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  canvas: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE + 100,
  },
  percentageBox: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  percentage: {
    fontSize: 20,
  },
});
