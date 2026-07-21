import React, { useState } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Header from '@/components/Header';
import Wheel from '@/components/Wheel';
import WalletView from '@/components/WalletView';

const segments = [5, 2, 4, 3, 1.3, 1.5];
const initialScore = 100; // starting points

export default function SpinAndWin() {
  const insets = useSafeAreaInsets();
  const labelOpacity = useSharedValue(0);
  const [multiplierLabel, setMultiplierLabel] = useState('');
  const score = useSharedValue(initialScore);

  const handleWheelEnd = (multiplier: number) => {
    const earned = Math.round(initialScore * multiplier);
    setMultiplierLabel(`×${multiplier}  →  ${earned} pts`);
    labelOpacity.value = withTiming(1, { duration: 800 });
    score.value = withTiming(earned, { duration: 800 });
  };

  const handleOnSpin = () => {
    score.value = initialScore;
    setMultiplierLabel('');
    labelOpacity.value = 0;
  };

  const scoreText = useDerivedValue(() => `${Math.round(score.value)}`);

  const topPadding = Platform.OS === 'web' ? 60 : insets.top;

  return (
    <LinearGradient
      style={[styles.container, { paddingTop: topPadding }]}
      colors={['#5C367D', '#00153B']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <Header />

      {/* Marafaking brand logo */}
      <View style={styles.brandWrapper}>
        <Text style={styles.brandGlow}>MARAFAKING</Text>
        <Text style={styles.brandText}>MARAFAKING</Text>
      </View>

      <Text style={styles.tagline}>🎮 Spin the Wheel · Win Points!</Text>

      <WalletView
        opacity={labelOpacity}
        scoreText={scoreText}
        multiplierLabel={multiplierLabel}
      />

      <Wheel segments={segments} onEnd={handleWheelEnd} onSpin={handleOnSpin} />

      {/* Game disclaimer — keeps it clearly a game for Play Store */}
      <View style={styles.disclaimerWrapper}>
        <Text style={styles.disclaimerText}>
          🎮 FOR ENTERTAINMENT ONLY · No real money · Virtual points only
        </Text>
      </View>
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
  // Glow layer — same text underneath, blurred gold colour
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
  // Sharp top layer
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
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  disclaimerWrapper: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  disclaimerText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 10,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});
