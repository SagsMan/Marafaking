import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Circle, Defs, G, LinearGradient, Path, Stop, Text as SText } from 'react-native-svg';
import Animated, { useAnimatedProps, SharedValue } from 'react-native-reanimated';
import { generateBowShape, generateDaggerShape, SCREEN_WIDTH } from '@/utils/Path';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const bowPath = generateBowShape();
const daggerPath = generateDaggerShape();

type SpinControlProps = {
  onSpin: () => void;
  animatedCircleY: SharedValue<number>;
};

const SpinControl: React.FC<SpinControlProps> = ({ onSpin, animatedCircleY }) => {
  const animatedCircleProps = useAnimatedProps(() => ({
    cy: animatedCircleY.value,
  }));

  return (
    <Svg width={SCREEN_WIDTH} height={180} style={styles.outerSvg}>
      <Defs>
        <LinearGradient id="spinGradient" x1="0" y1="0" x2="0" y2="100%">
          <Stop offset="0%" stopColor="#BD7A2A" stopOpacity="1" />
          <Stop offset="100%" stopColor="#D89834" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Path d={bowPath} stroke="#F4CB79" strokeWidth={8} fill="none" />
      <G>
        <Path d={daggerPath} stroke="#F4CB79" strokeWidth={6} fill="#F4CB79" />
        <Circle cx={SCREEN_WIDTH / 2} cy="124" r="55" fill="#B8783C" />
        <AnimatedCircle
          onPress={onSpin}
          cx={SCREEN_WIDTH / 2}
          animatedProps={animatedCircleProps}
          r="55"
          fill="#FCE2A7"
        />
        <SText
          x={SCREEN_WIDTH / 2}
          y="130"
          textAnchor="middle"
          fontSize="36"
          fontWeight="bolder"
          fill="url(#spinGradient)"
        >
          SPIN
        </SText>
      </G>
    </Svg>
  );
};

export default SpinControl;

const styles = StyleSheet.create({
  outerSvg: {
    position: 'absolute',
    bottom: '32%',
    zIndex: 2,
  },
});
