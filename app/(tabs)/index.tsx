import React, { useState } from 'react';
import { Alert, BackHandler, Platform, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import Wheel from '@/components/Wheel';
import PrizeModal from '@/components/PrizeModal';
import type { Prize } from '@/utils/Path';

// ── Prize pool — purely fictional in-game gifts ──────────────────────────────
const PRIZES: Prize[] = [
  { emoji: '🎁', name: 'Mystery Box' },
  { emoji: '👟', name: 'Sneakers'    },
  { emoji: '🎮', name: 'GamePad'     },
  { emoji: '🍕', name: 'Free Pizza'  },
  { emoji: '🎧', name: 'Headset'     },
  { emoji: '🍀', name: 'Lucky Box'   },
];

export default function SpinAndWin() {
  const insets = useSafeAreaInsets();

  // wonPrize drives the modal — null = hidden, Prize = visible
  const [wonPrize, setWonPrize]     = useState<Prize | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleWheelEnd = (index: number) => {
    setIsSpinning(false);
    setWonPrize(PRIZES[index]);
  };

  const handleOnSpin = () => {
    setIsSpinning(true);
    setWonPrize(null);
  };

  const handlePlayAgain = () => {
    setWonPrize(null);
  };

  const handleClose = () => {
    Alert.alert(
      'Quit Game',
      'Are you sure you want to exit?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Exit',
          style: 'destructive',
          onPress: () => {
            if (Platform.OS === 'android') {
              BackHandler.exitApp();
            }
            // on iOS there is no programmatic exit — the button still gives feedback
          },
        },
      ],
      { cancelable: true }
    );
  };

  const topPadding = Platform.OS === 'web' ? 60 : insets.top;

  return (
    <LinearGradient
      style={[styles.container, { paddingTop: topPadding }]}
      colors={['#5C367D', '#00153B']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      {/* Header with working X button */}
      <Header onClose={handleClose} />

      {/* Brand logo */}
      <View style={styles.brandWrapper}>
        <Text style={styles.brandGlow}>MARAFAKING</Text>
        <Text style={styles.brandText}>MARAFAKING</Text>
      </View>

      <Text style={styles.tagline}>🎮 Spin the Wheel · Win a Gift!</Text>

      <Wheel prizes={PRIZES} onEnd={handleWheelEnd} onSpin={handleOnSpin} />

      {/* Prize claim modal — appears after wheel stops */}
      <PrizeModal prize={wonPrize} onPlayAgain={handlePlayAgain} />
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
