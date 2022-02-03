import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { PercentGauge } from 'react-native-circular-gauge';

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
  const [percents, setPercents] = useState([30, 50, 20]);

  const [p1, p2, p3] = percents;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Macronutrients</Text>
      <Text style={styles.subTitle}>Protein, Fats, Carbs</Text>
      <View style={styles.canvas}>
        <View style={styles.percentageContainer}>
          <View style={styles.percentageBox}>
            <Text style={styles.percentage}>Fats</Text>
            <Text>{p1}%</Text>
          </View>
          <View style={styles.percentageBox}>
            <Text style={styles.percentage}>Carbs</Text>
            <Text>{p2}%</Text>
          </View>
        </View>
        <PercentGauge
          size={CIRCLE_SIZE}
          showScale={true}
          percent={percents}
          getBarColor={(index) => barColors[index]}
          getPointerColor={(index) => pointerColors[index]}
          onChange={(percents) => {
            setPercents(percents.map((percent) => Math.round(percent)));
          }}
        />
        <View style={styles.percentageContainer}>
          <View style={styles.percentageBox}>
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
  percentageContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  percentageBox: { alignItems: 'center', justifyContent: 'center' },
  percentage: {
    fontSize: 20,
  },
});
