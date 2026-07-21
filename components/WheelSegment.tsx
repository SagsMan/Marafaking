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
      <G
        x={segment.centroid[0]}
        y={segment.centroid[1]}
        transform={`rotate(${segment.rotationAngle})`}
      >
        <Rect x={-20} y={-12} width={50} height={30} rx={5} ry={5} fill="#F4CB79" />
        <SText
          fontSize={14}
          x={-3}
          y={3.5}
          fontWeight="bold"
          textAnchor="middle"
          alignmentBaseline="central"
          fill="#fff"
        >
          X {segment.amount}
        </SText>
      </G>
    </G>
  );
};

export default WheelSegment;
