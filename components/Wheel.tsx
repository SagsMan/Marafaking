import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { G } from 'react-native-svg';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  SharedValue,
} from 'react-native-reanimated';
import { generateWheelSegments, SCREEN_WIDTH } from '@/utils/Path';
import SpinControl from './SpinControl';
import WheelSegment from './WheelSegment';

type WheelProps = {
  segments: number[];
  onEnd: (value: number) => void;
  onSpin: () => void;
};

const Wheel: React.FC<WheelProps> = ({ segments, onEnd, onSpin }) => {
  const rotation = useSharedValue(0);
  const colorProgress = useSharedValue(0);
  const animatedCircleY = useSharedValue(120);
  const [randomIndex, setRandomIndex] = useState(
    Math.floor(Math.random() * segments.length)
  );
  const selectedSegmentAnimatedIndex = useSharedValue(randomIndex);

  const spinWheel = () => {
    const newIndex = Math.floor(Math.random() * segments.length);
    setRandomIndex(newIndex);
    selectedSegmentAnimatedIndex.value = newIndex;
    rotation.value = 0;
    const spins = 5;
    const fullSpins = 360 * spins;
    const segmentAngle = 360 / segments.length;
    const finalRotation = fullSpins - segmentAngle * newIndex;

    colorProgress.value = 0;

    rotation.value = withTiming(
      finalRotation,
      { duration: 5000, easing: Easing.bezier(0.33, 1, 0.68, 1) },
      (finished) => {
        if (finished) {
          colorProgress.value = withTiming(1);
          runOnJS(onEnd)(segments[newIndex]);
        }
      }
    );

    animatedCircleY.value = withSequence(
      withTiming(115, { duration: 2500 }),
      withTiming(120, { duration: 2500 })
    );

    onSpin();
  };

  const animatedWheelStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const segmentData = generateWheelSegments(segments);

  return (
    <View style={styles.container}>
      <SpinControl animatedCircleY={animatedCircleY} onSpin={spinWheel} />
      {/* Use Animated.View for rotation so reanimated never calls setNativeProps on SVG */}
      <Animated.View style={animatedWheelStyle}>
        <Svg width={SCREEN_WIDTH} height={SCREEN_WIDTH}>
          <G x={SCREEN_WIDTH / 2} y={SCREEN_WIDTH / 2}>
            {segmentData.map((segmentItem, index) => (
              <WheelSegment
                key={index}
                index={index}
                colorProgress={colorProgress}
                segment={segmentItem}
                selectedSegmentAnimatedIndex={selectedSegmentAnimatedIndex}
              />
            ))}
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
};

export default Wheel;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
});
