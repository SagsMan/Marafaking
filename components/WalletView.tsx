import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
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
  walletBalance: string;
  amountText: SharedValue<string>;
  opacity: SharedValue<number>;
};

const WalletView: React.FC<WalletViewProps> = ({ walletBalance, amountText, opacity }) => {
  const [displayAmount, setDisplayAmount] = useState(amountText.value);

  useAnimatedReaction(
    () => amountText.value,
    (current) => {
      runOnJS(setDisplayAmount)(current);
    }
  );

  const labelStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const walletContentStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      opacity.value,
      [0, 1],
      ['rgba(209, 177, 177, 0.4)', '#D1A15F']
    ),
    borderWidth: interpolate(opacity.value, [0, 1], [1, 2]),
  }));

  return (
    <View style={styles.walletView}>
      {/* Animated label badge */}
      <Animated.View style={[styles.walletLabel, labelStyle]}>
        <LinearGradient
          colors={['#FFEAA2', '#ECB65B']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
        <FontAwesome name="dollar" size={18} />
        <Text style={styles.walletLabelText}>{walletBalance}</Text>
      </Animated.View>

      {/* Wallet content card */}
      <Animated.View style={[styles.walletContent, walletContentStyle]}>
        <LinearGradient
          colors={['#303053', '#4C4A5F']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <FontAwesome5 name="coins" size={50} color="white" />
        <View style={styles.walletTextContainer}>
          <Text style={styles.addedToWalletText}>Added To Wallet</Text>
          <View style={styles.walletAmountContainer}>
            <FontAwesome name="dollar" size={24} color="white" />
            <Text style={styles.walletAmountText}>{displayAmount}</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default WalletView;

const styles = StyleSheet.create({
  walletView: {
    position: 'relative',
    marginTop: 30,
  },
  walletLabel: {
    flexDirection: 'row',
    justifyContent: 'center',
    columnGap: 4,
    alignItems: 'center',
    position: 'absolute',
    top: -15,
    zIndex: 2,
    width: 100,
    left: (SCREEN_WIDTH / 2 - 100) / 2,
    borderRadius: 50,
    paddingHorizontal: 12,
    height: 35,
    overflow: 'hidden',
  },
  walletContent: {
    width: SCREEN_WIDTH / 2,
    height: 110,
    borderColor: 'rgba(209, 177, 177, 0.4)',
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    overflow: 'hidden',
  },
  walletTextContainer: {
    rowGap: 8,
  },
  addedToWalletText: {
    color: 'white',
  },
  walletAmountContainer: {
    flexDirection: 'row',
    columnGap: 10,
    alignItems: 'center',
  },
  walletAmountText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
