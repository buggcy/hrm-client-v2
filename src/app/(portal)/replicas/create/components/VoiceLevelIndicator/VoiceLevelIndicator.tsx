import { useMemo } from 'react';

export const VoiceLevelIndicator: React.FC<{
  voiceLevel: number;
}> = ({ voiceLevel }) => {
  const dots = useMemo(() => {
    const baseHeight = 1; // Minimum height of dots in pixels

    return [0, 1, 2, 3, 4].map(index => {
      const distanceFromCenter = Math.abs(index - 2);
      const heightFactor = 1 - (distanceFromCenter / 2) * 0.5; // Center grows 100%, sides 50%
      const dotHeight =
        baseHeight + Math.round(voiceLevel * 100) * heightFactor * 1.1;

      return (
        <div
          key={index}
          className="w-1.5 rounded-md bg-primary transition-all duration-100 ease-in-out"
          style={{ height: `${dotHeight}%` }}
        ></div>
      );
    });
  }, [voiceLevel]);

  return (
    <div className="flex size-6 items-center justify-center gap-0.5 overflow-hidden rounded-full border bg-background px-0.5">
      {dots}
    </div>
  );
};
