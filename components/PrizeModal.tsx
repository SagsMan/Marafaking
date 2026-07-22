import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated as RNAnimated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Prize } from '@/utils/Path';

const { width } = Dimensions.get('window');

interface Props {
  prize: Prize | null;
  onPlayAgain: () => void;
}

export default function PrizeModal({ prize, onPlayAgain }: Props) {
  const visible = prize !== null;

  // Card scale + opacity entrance animation
  const scale   = useRef(new RNAnimated.Value(0.5)).current;
  const opacity = useRef(new RNAnimated.Value(0)).current;
  // Glow pulse on the prize emoji
  const glow    = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset then spring in
      scale.setValue(0.5);
      opacity.setValue(0);
      RNAnimated.parallel([
        RNAnimated.spring(scale, {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: true,
        }),
        RNAnimated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Start glow pulse after card lands
        RNAnimated.loop(
          RNAnimated.sequence([
            RNAnimated.timing(glow, { toValue: 1, duration: 700, useNativeDriver: false }),
            RNAnimated.timing(glow, { toValue: 0, duration: 700, useNativeDriver: false }),
          ])
        ).start();
      });
    } else {
      glow.stopAnimation();
      glow.setValue(0);
    }
  }, [visible]);

  const glowRadius = glow.interpolate({ inputRange: [0, 1], outputRange: [8, 32] });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onPlayAgain}
    >
      {/* Dimmed backdrop */}
      <View style={styles.backdrop}>

        {/* Animated card */}
        <RNAnimated.View style={[styles.cardWrap, { opacity, transform: [{ scale }] }]}>
          <LinearGradient
            colors={['#2B1F5C', '#1A0D3B']}
            style={styles.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Top accent bar */}
            <LinearGradient
              colors={['#FFD700', '#FFA500']}
              style={styles.accentBar}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />

            {/* Header */}
            <Text style={styles.title}>🎉 You Won!</Text>
            <Text style={styles.subtitle}>Your prize has been claimed</Text>

            {/* Prize emoji with animated glow shadow */}
            <RNAnimated.Text
              style={[
                styles.prizeEmoji,
                { textShadowRadius: glowRadius },
              ]}
            >
              {prize?.emoji ?? '🎁'}
            </RNAnimated.Text>

            {/* Prize name pill */}
            <View style={styles.namePill}>
              <Text style={styles.prizeName}>{prize?.name ?? ''}</Text>
            </View>

            {/* Claim message */}
            <Text style={styles.claimMsg}>
              🎁 Gift claimed! Come back and{'\n'}spin again for more prizes.
            </Text>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Play Again button */}
            <TouchableOpacity
              style={styles.playAgainBtn}
              onPress={onPlayAgain}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                style={styles.playAgainGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.playAgainText}>🔄 PLAY AGAIN</Text>
              </LinearGradient>
            </TouchableOpacity>

          </LinearGradient>
        </RNAnimated.View>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.78)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrap: {
    width: width * 0.84,
    borderRadius: 24,
    overflow: 'hidden',
    // gold border glow
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  card: {
    alignItems: 'center',
    paddingBottom: 28,
  },
  accentBar: {
    width: '100%',
    height: 5,
    marginBottom: 22,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 1,
    textShadowColor: '#FFD700',
    textShadowRadius: 12,
    textShadowOffset: { width: 0, height: 0 },
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  prizeEmoji: {
    fontSize: 90,
    marginTop: 18,
    marginBottom: 12,
    textShadowColor: '#FFD700',
    textShadowOffset: { width: 0, height: 0 },
  },
  namePill: {
    backgroundColor: 'rgba(255,215,0,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.45)',
    borderRadius: 50,
    paddingHorizontal: 24,
    paddingVertical: 7,
    marginBottom: 16,
  },
  prizeName: {
    color: '#FFE88A',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  claimMsg: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  divider: {
    width: '80%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginVertical: 20,
  },
  playAgainBtn: {
    width: width * 0.65,
    borderRadius: 50,
    overflow: 'hidden',
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  playAgainGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 50,
  },
  playAgainText: {
    color: '#1A0D3B',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 2,
  },
});
