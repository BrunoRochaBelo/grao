import type { HTMLAttributes } from 'react';
import { cn } from '@/components/ui/utils';

interface SparklineProps extends HTMLAttributes<svg> {
  data: number[];
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
}

export function Sparkline({
  data,
  stroke = '#7C3AED',
  fill,
  strokeWidth = 2,
  className,
  ...props
}: SparklineProps) {
  const sanitized = data.filter(value => Number.isFinite(value));

  if (sanitized.length < 2) {
    return (
      <svg
        viewBox="0 0 100 32"
        className={cn('w-full h-8 text-muted-foreground/60', className)}
        aria-hidden
        {...props}
      >
        <line
          x1={0}
          y1={16}
          x2={100}
          y2={16}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          opacity={0.4}
        />
      </svg>
    );
  }

  const width = 100;
  const height = 32;
  const min = Math.min(...sanitized);
  const max = Math.max(...sanitized);
  const range = max - min || 1;
  const points = sanitized
    .map((value, index) => {
      const x = (index / (sanitized.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn('w-full h-8 text-muted-foreground/60', className)}
      role="img"
      aria-hidden
      {...props}
    >
      {fill && (
        <polygon
          points={areaPoints}
          fill={fill}
          opacity={0.12}
        />
      )}
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {sanitized.length > 0 && (
        <circle
          cx={points.split(' ').pop()?.split(',')[0] ?? '0'}
          cy={points.split(' ').pop()?.split(',')[1] ?? '0'}
          r={strokeWidth * 1.2}
          fill={stroke}
        />
      )}
    </svg>
  );
}
