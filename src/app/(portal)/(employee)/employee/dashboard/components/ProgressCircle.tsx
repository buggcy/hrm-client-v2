import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
type ProgressCircleProps = {
  value: number;
  max: number;
  strokeColor: string;
  tooltipText?: string;
};

const ProgressCircle = ({
  value,
  max,
  strokeColor,
  tooltipText,
}: ProgressCircleProps) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / max) * 100;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <svg width={100} height={100} viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#e5e7eb"
              strokeWidth="10"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke={strokeColor}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dy=".3em"
              fontSize="1.5rem"
              className="font-bold text-primary"
            >
              {value}
            </text>
          </svg>
        </TooltipTrigger>
        <TooltipContent>
          {tooltipText || `Progress: ${value}/${max}`}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ProgressCircle;
