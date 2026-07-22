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

type PrizeCardProps = {
  prizeEmoji: SharedValue<string>;
  prizeName: SharedValue<string>;
  opacity: SharedValue<number>;
};

const PrizeCard: React.FC<PrizeCardProps> = ({ prizeEmoji, prizeName, opacity }) => {
  const [emoji, setEmoji] = useState('🎁');
  const [name, setName] = useState('');

  useAnimatedReaction(
    () => prizeEmoji.value,
    (v) => runOnJS(setEmoji)(v)
  );
  useAnimatedReaction(
    () => prizeName.value,
    (v) => runOnJS(setName)(v)
  );

  const wrapperStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      opacity.value,
      [0, 1],
      ['rgba(209,177,177,0.1)', '#D1A15F']
    ),
    borderWidth: interpolate(opacity.value, [0, 1], [1, 2]),
  }));

  return (
    <Animated.View style={[styles.wrapper, wrapperStyle]}>
      {/* "You Won!" badge */}
      <View style={styles.badge}>
        <LinearGradient
          colors={['#FFEAA2', '#ECB65B']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
        <Text style={styles.badgeText}>🎉 You Won!</Text>
      </View>

      <Animated.View style={[styles.card, cardStyle]}>
        <LinearGradient
          colors={['#303053', '#4C4A5F']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <Text style={styles.emojiText}>{emoji}</Text>
        <View style={styles.textBlock}>
          <Text style={styles.wonLabel}>Your Prize</Text>
          <Text style={styles.prizeName}>{name}</Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default PrizeCard;

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'center',
    marginTop: 30,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -16,
    alignSelf: 'center',
    left: 0,
    right: 0,
    marginHorizontal: 'auto',
    width: 120,
    height: 32,
    borderRadius: 50,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  badgeText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#3a2a00',
  },
  card: {
    width: SCREEN_WIDTH * 0.72,
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(209,177,177,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 18,
    overflow: 'hidden',
  },
  emojiText: {
    fontSize: 50,
  },
  textBlock: {
    gap: 4,
  },
  wonLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  prizeName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
});
