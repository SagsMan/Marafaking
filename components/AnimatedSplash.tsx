import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface Props {
  onFinish: () => void;
}

export default function AnimatedSplash({ onFinish }: Props) {
  // Overall screen fade-out (at the very end)
  const screenOpacity = useSharedValue(1);
  // MARAFAKING text: fade in then glow-pulse
  const textOpacity   = useSharedValue(0);
  const textScale     = useSharedValue(0.85);
  const glowOpacity   = useSharedValue(0);

  useEffect(() => {
    // 1. After 400 ms, fade + scale MARAFAKING in
    textOpacity.value = withDelay(400, withTiming(1, { duration: 900 }));
    textScale.value   = withDelay(400, withTiming(1, { duration: 900, easing: Easing.out(Easing.back(1.4)) }));

    // 2. After the text appears, start looping glow pulse
    glowOpacity.value = withDelay(
      1400,
      withRepeat(
        withSequence(
          withTiming(1,   { duration: 700, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,   // infinite
        false,
      ),
    );

    // 3. At ~4 s total, fade out the whole screen then call onFinish
    const timeout = setTimeout(() => {
      screenOpacity.value = withTiming(0, { duration: 600 }, (finished) => {
        if (finished) runOnJS(onFinish)();
      });
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);

  const screenStyle = useAnimatedStyle(() => ({ opacity: screenOpacity.value }));
  const textStyle   = useAnimatedStyle(() => ({
    opacity:   textOpacity.value,
    transform: [{ scale: textScale.value }],
  }));
  const glowStyle   = useAnimatedStyle(() => ({ opacity: glowOpacity.value }));

  return (
    <Animated.View style={[styles.container, screenStyle]}>
      {/* Splash image */}
      <View style={styles.imageWrap}>
        <Image
          source={require('@/assets/images/splash.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Animated MARAFAKING text */}
      <Animated.View style={[styles.textWrap, textStyle]}>
        {/* Glow layer (behind) */}
        <Animated.Text style={[styles.textGlow, glowStyle]}>
          MARAFAKING
        </Animated.Text>
        {/* Solid text (front) */}
        <Animated.Text style={styles.text}>
          MARAFAKING
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#00153B',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  imageWrap: {
    width:  width * 0.72,
    height: height * 0.42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width:  '100%',
    height: '100%',
  },
  textWrap: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    position:    'absolute',
    fontSize:    42,
    fontWeight:  '900',
    letterSpacing: 6,
    color:       '#FFD700',
    textAlign:   'center',
  },
  textGlow: {
    fontSize:    42,
    fontWeight:  '900',
    letterSpacing: 6,
    color:       '#FFD700',
    textAlign:   'center',
    // glow via shadow
    textShadowColor:  '#FFD700',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 24,
  },
});
