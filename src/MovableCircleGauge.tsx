import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PADDING } from './global/Constants';

export default function MovableCircleGauge() {
  return (
    <View style={styles.container}>
      <Text>init</Text>
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
});
