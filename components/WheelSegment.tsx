import React, { useState } from 'react';
import { G, Path, Text as SText } from 'react-native-svg';
import {
  interpolateColor,
  runOnJS,
  useAnimatedReaction,
  SharedValue,
} from 'react-native-reanimated';
import type { Prize } from '@/utils/Path';

export type SegmentData = {
  pathData: string;
  centroid: [number, number];
  rotationAngle: number;
  prize: Prize;
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
        ? '#C4A8F5'
        : (interpolateColor(progress, [0, 1], ['#AF93EA', '#6B3FA8']) as string);
      runOnJS(setFillColor)(color);
    }
  );

  return (
    <G>
      <Path d={segment.pathData} fill={fillColor} stroke="#C2ABC0" strokeWidth={1.5} />
      {/* Emoji label — no badge background, just the emoji + short name */}
      <G x={segment.centroid[0]} y={segment.centroid[1]}>
        {/* Emoji */}
        <SText
          fontSize={26}
          x={0}
          y={-4}
          textAnchor="middle"
          alignmentBaseline="central"
        >
          {segment.prize.emoji}
        </SText>
        {/* Prize name */}
        <SText
          fontSize={9}
          x={0}
          y={16}
          textAnchor="middle"
          alignmentBaseline="central"
          fill="#fff"
          fontWeight="bold"
        >
          {segment.prize.name}
        </SText>
      </G>
    </G>
  );
};

export default WheelSegment;
