import React, { useState } from 'react';
import { G, Path, Rect, Text as SText } from 'react-native-svg';
import {
  interpolateColor,
  runOnJS,
  useAnimatedReaction,
  SharedValue,
} from 'react-native-reanimated';

type SegmentData = {
  pathData: string;
  centroid: [number, number];
  rotationAngle: number;
  amount: number;
};

type WheelSegmentProps = {
  segment: SegmentData;
  selectedSegmentAnimatedIndex: SharedValue<number>;
  colorProgress: SharedValue<number>;
  index: number;
};

const WheelSegment: React.FC<WheelSegmentProps> = ({
  segment,
  selectedSegmentAnimatedIndex,
  colorProgress,
  index,
}) => {
  const [fillColor, setFillColor] = useState('#AF93EA');

  useAnimatedReaction(
    () => ({
      isSelected: selectedSegmentAnimatedIndex.value === index,
      progress: colorProgress.value,
    }),
    ({ isSelected, progress }) => {
      const color = isSelected
        ? '#AF93EA'
        : (interpolateColor(progress, [0, 1], ['#AF93EA', '#724cbd']) as string);
      runOnJS(setFillColor)(color);
    }
  );

  return (
    <G>
      <Path d={segment.pathData} fill={fillColor} stroke="#C2ABC0" />
      {/* No rotation — keep all labels horizontal and readable */}
      <G x={segment.centroid[0]} y={segment.centroid[1]}>
        <Rect x={-26} y={-14} width={52} height={28} rx={6} ry={6} fill="#F4CB79" />
        <SText
          fontSize={13}
          x={0}
          y={4}
          fontWeight="bold"
          textAnchor="middle"
          fill="#fff"
        >
          X{segment.amount}
        </SText>
      </G>
    </G>
  );
};

export default WheelSegment;
