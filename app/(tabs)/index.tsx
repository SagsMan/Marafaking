import React, { useState } from 'react';
import { StyleSheet, Text, Platform } from 'react-native';
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
const initialBalance = 1.7;
const initialBalanceStr = '1.7';

export default function SpinAndWin() {
  const insets = useSafeAreaInsets();
  const labelOpacity = useSharedValue(0);
  const [walletBalance, setWalletBalance] = useState('');
  const amount = useSharedValue(initialBalance);

  const handleWheelEnd = (value: number) => {
    setWalletBalance(initialBalanceStr + ' x ' + value.toString());
    labelOpacity.value = withTiming(1, { duration: 800 });
    amount.value = withTiming(value * initialBalance, { duration: 800 });
  };

  const handleOnSpin = () => {
    amount.value = initialBalance;
    setWalletBalance('');
    labelOpacity.value = 0;
  };

  const amountText = useDerivedValue(() => `${amount.value.toFixed(1)}`);

  const topPadding = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <LinearGradient
      style={[styles.container, { paddingTop: topPadding }]}
      colors={['#5C367D', '#00153B']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <Header />
      <Text style={styles.multiplyEarningsText}>Multiply your Earnings</Text>
      <WalletView
        opacity={labelOpacity}
        amountText={amountText}
        walletBalance={walletBalance}
      />
      <Wheel segments={segments} onEnd={handleWheelEnd} onSpin={handleOnSpin} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  multiplyEarningsText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    marginBottom: 20,
  },
});
