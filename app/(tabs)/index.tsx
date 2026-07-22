import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Header from '@/components/Header';
import Wheel from '@/components/Wheel';
import PrizeCard from '@/components/PrizeCard';
import type { Prize } from '@/utils/Path';

// ── Prize pool — purely fictional in-game gifts ──────────────────────────────
const PRIZES: Prize[] = [
  { emoji: '🎁', name: 'Mystery Box' },
  { emoji: '👟', name: 'Sneakers'   },
  { emoji: '🎮', name: 'GamePad'    },
  { emoji: '🍕', name: 'Free Pizza' },
  { emoji: '🎧', name: 'Headset'    },
  { emoji: '🍀', name: 'Lucky Box'  },
];

export default function SpinAndWin() {
  const insets = useSafeAreaInsets();
  const prizeOpacity = useSharedValue(0);
  const prizeEmoji = useSharedValue('🎁');
  const prizeName  = useSharedValue('');

  const handleWheelEnd = (index: number) => {
    const won = PRIZES[index];
    prizeEmoji.value = won.emoji;
    prizeName.value  = won.name;
    prizeOpacity.value = withTiming(1, { duration: 800 });
  };

  const handleOnSpin = () => {
    prizeOpacity.value = 0;
    prizeName.value    = '';
  };

  const topPadding = Platform.OS === 'web' ? 60 : insets.top;

  return (
    <LinearGradient
      style={[styles.container, { paddingTop: topPadding }]}
      colors={['#5C367D', '#00153B']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <Header />

      {/* Brand logo */}
      <View style={styles.brandWrapper}>
        <Text style={styles.brandGlow}>MARAFAKING</Text>
        <Text style={styles.brandText}>MARAFAKING</Text>
      </View>

      <Text style={styles.tagline}>🎮 Spin the Wheel · Win a Gift!</Text>

      {/* Prize reveal card */}
      <PrizeCard
        opacity={prizeOpacity}
        prizeEmoji={prizeEmoji}
        prizeName={prizeName}
      />

      <Wheel prizes={PRIZES} onEnd={handleWheelEnd} onSpin={handleOnSpin} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  brandWrapper: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandGlow: {
    position: 'absolute',
    color: '#FFD700',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 6,
    textShadowColor: '#FFD700',
    textShadowRadius: 24,
    textShadowOffset: { width: 0, height: 0 },
    opacity: 0.7,
  },
  brandText: {
    color: '#FFE680',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 6,
    textShadowColor: '#FFA500',
    textShadowRadius: 6,
    textShadowOffset: { width: 0, height: 0 },
  },
  tagline: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
});
