import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated as RNAnimated } from 'react-native';

interface Props {
  count: number;
}

export default function GiftCounter({ count }: Props) {
  const scale = useRef(new RNAnimated.Value(1)).current;
  const prevCount = useRef(count);

  useEffect(() => {
    if (count !== prevCount.current && count > 0) {
      prevCount.current = count;
      // Pop animation every time count increases
      RNAnimated.sequence([
        RNAnimated.timing(scale, { toValue: 1.45, duration: 160, useNativeDriver: true }),
        RNAnimated.spring(scale,  { toValue: 1,    friction: 4,  useNativeDriver: true }),
      ]).start();
    }
  }, [count]);

  return (
    <View style={styles.wrapper}>
      <RNAnimated.View style={[styles.pill, { transform: [{ scale }] }]}>
        <Text style={styles.emoji}>🎁</Text>
        <View style={styles.textCol}>
          <Text style={styles.label}>GIFTS WON</Text>
          <Text style={styles.count}>{count}</Text>
        </View>
      </RNAnimated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'center',
    marginTop: 6,
    marginBottom: 2,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,215,0,0.13)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,215,0,0.4)',
    borderRadius: 50,
    paddingHorizontal: 18,
    paddingVertical: 7,
    gap: 10,
  },
  emoji: {
    fontSize: 26,
  },
  textCol: {
    alignItems: 'flex-start',
  },
  label: {
    color: 'rgba(255,215,0,0.7)',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
  },
  count: {
    color: '#FFD700',
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 30,
  },
});
