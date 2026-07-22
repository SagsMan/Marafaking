import React, { useState, useEffect } from 'react';
import { Alert, BackHandler, Platform, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import Wheel from '@/components/Wheel';
import PrizeModal from '@/components/PrizeModal';
import GiftCounter from '@/components/GiftCounter';
import type { Prize } from '@/utils/Path';

const GIFT_COUNT_KEY = '@marafaking_gift_count';

// ── Prize pool — purely fictional in-game virtual prizes ─────────────────────
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

  const [wonPrize, setWonPrize]     = useState<Prize | null>(null);
  const [giftCount, setGiftCount]   = useState(0);

  // Load persisted count on mount
  useEffect(() => {
    AsyncStorage.getItem(GIFT_COUNT_KEY).then((val) => {
      if (val !== null) setGiftCount(parseInt(val, 10) || 0);
    });
  }, []);

  const handleWheelEnd = (index: number) => {
    setWonPrize(PRIZES[index]);
  };

  const handleOnSpin = () => {
    setWonPrize(null);
  };

  const handlePlayAgain = async () => {
    // Increment and persist gift count when player claims
    const next = giftCount + 1;
    setGiftCount(next);
    await AsyncStorage.setItem(GIFT_COUNT_KEY, String(next));
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
            if (Platform.OS === 'android') BackHandler.exitApp();
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
      <Header onClose={handleClose} />

      {/* Brand logo */}
      <View style={styles.brandWrapper}>
        <Text style={styles.brandGlow}>MARAFAKING</Text>
        <Text style={styles.brandText}>MARAFAKING</Text>
      </View>

      <Text style={styles.tagline}>🎮 Spin · Collect Virtual Prizes!</Text>

      {/* Persistent gift counter */}
      <GiftCounter count={giftCount} />

      <Wheel prizes={PRIZES} onEnd={handleWheelEnd} onSpin={handleOnSpin} />

      {/* Prize claim modal */}
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
    marginBottom: 2,
    letterSpacing: 0.5,
  },
});
