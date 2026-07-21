import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  SharedValue,
} from 'react-native-reanimated';
import { SCREEN_WIDTH } from '@/utils/Path';

type WalletViewProps = {
  multiplierLabel: string;
  scoreText: SharedValue<string>;
  opacity: SharedValue<number>;
};

const WalletView: React.FC<WalletViewProps> = ({ multiplierLabel, scoreText, opacity }) => {
  const [displayScore, setDisplayScore] = useState(scoreText.value);

  useAnimatedReaction(
    () => scoreText.value,
    (current) => {
      runOnJS(setDisplayScore)(current);
    }
  );

  const labelStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      opacity.value,
      [0, 1],
      ['rgba(209, 177, 177, 0.2)', '#D1A15F']
    ),
    borderWidth: interpolate(opacity.value, [0, 1], [1, 2]),
  }));

  return (
    <View style={styles.wrapper}>
      {/* Multiplier badge — appears after spin */}
      <Animated.View style={[styles.badge, labelStyle]}>
        <LinearGradient
          colors={['#FFEAA2', '#ECB65B']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
        <Text style={styles.badgeText}>{multiplierLabel}</Text>
      </Animated.View>

      {/* Score card */}
      <Animated.View style={[styles.card, cardStyle]}>
        <LinearGradient
          colors={['#303053', '#4C4A5F']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        {/* Coin emoji — always renders on native & web */}
        <Text style={styles.coinEmoji}>🪙</Text>
        <View style={styles.textBlock}>
          <Text style={styles.labelText}>Points Earned</Text>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreText}>{displayScore}</Text>
            <Text style={styles.ptsLabel}> pts</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default WalletView;

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    marginTop: 30,
    alignSelf: 'center',
  },
  badge: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -16,
    zIndex: 2,
    alignSelf: 'center',
    left: 0,
    right: 0,
    marginHorizontal: 'auto',
    width: 130,
    borderRadius: 50,
    height: 32,
    overflow: 'hidden',
  },
  badgeText: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#3a2a00',
  },
  card: {
    width: SCREEN_WIDTH * 0.7,
    height: 100,
    borderColor: 'rgba(209, 177, 177, 0.2)',
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 16,
    overflow: 'hidden',
  },
  coinEmoji: {
    fontSize: 44,
  },
  textBlock: {
    gap: 4,
  },
  labelText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  ptsLabel: {
    color: '#F4CB79',
    fontSize: 14,
    fontWeight: '600',
  },
});
