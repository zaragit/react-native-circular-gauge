import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { PADDING } from './src/global/Constants';
import MovableCircleGauge from './src/MovableCircleGauge';

export default function App() {
  return (
    <View style={styles.container}>
      <MovableCircleGauge />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: PADDING,
  },
});
