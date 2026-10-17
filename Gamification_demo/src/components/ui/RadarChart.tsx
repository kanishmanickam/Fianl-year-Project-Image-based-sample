import React from 'react';

interface RadarDataPoint {
  label: string;
  value: number;
}

interface RadarChartProps {
  data: RadarDataPoint[];
  maxValue: number;
  color: string;
  glowColor: string;
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  data,
  maxValue,
  color,
  glowColor,
  size = 300
}) => {
  const padding = 50;
  const chartSize = size + padding * 2;
  const center = chartSize / 2;
  const radius = size / 2;
  const totalSides = data.length;

  // Calculate coordinates for a given value at an angle index
  const getCoordinates = (index: number, val: number) => {
    const angle = (Math.PI * 2 * index) / totalSides - Math.PI / 2;
    const ratio = Math.max(0, Math.min(val / maxValue, 1.0));
    const r = ratio * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Generate grid levels (0.25, 0.5, 0.75, 1.0)
  const levels = [0.25, 0.5, 0.75, 1.0];
  const gridPolygons = levels.map((lvl) => {
    const points = Array.from({ length: totalSides }, (_, idx) => {
      const { x, y } = getCoordinates(idx, lvl * maxValue);
      return `${x},${y}`;
    }).join(' ');
    return points;
  });

  // Calculate coordinates for the actual data polygon
  const dataPoints = data.map((d, idx) => {
    const { x, y } = getCoordinates(idx, d.value);
    return `${x},${y}`;
  }).join(' ');

  // Get labels positioning
  const labelsList = data.map((d, idx) => {
    const angle = (Math.PI * 2 * idx) / totalSides - Math.PI / 2;
    // Push labels slightly outside the main radius
    const labelRadius = radius + 22;
    const x = center + labelRadius * Math.cos(angle);
    const y = center + labelRadius * Math.sin(angle);

    // Text alignment adjustments
    let textAnchor: 'start' | 'middle' | 'end' | 'inherit' = 'middle';
    if (Math.cos(angle) > 0.1) textAnchor = 'start';
    else if (Math.cos(angle) < -0.1) textAnchor = 'end';

    let dy = '0.35em';
    if (Math.sin(angle) > 0.8) dy = '0.9em';
    else if (Math.sin(angle) < -0.8) dy = '-0.2em';

    return {
      text: d.label,
      x,
      y,
      textAnchor,
      dy
    };
  });

  // Web lines from center to outer points
  const webLines = Array.from({ length: totalSides }, (_, idx) => {
    const outer = getCoordinates(idx, maxValue);
    return { x1: center, y1: center, x2: outer.x, y2: outer.y };
  });

  return (
    <div className="flex flex-col items-center justify-center p-2 bg-slate-950/40 rounded-2xl border border-slate-800/40">
      <svg width="100%" height="100%" viewBox={`0 0 ${chartSize} ${chartSize}`} className="max-w-[320px] select-none">
        <defs>
          <filter id={`glow-${glowColor}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer and inner concentric grid polygons */}
        {gridPolygons.map((points, idx) => (
          <polygon
            key={idx}
            points={points}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        ))}

        {/* Web lines */}
        {webLines.map((line, idx) => (
          <line
            key={idx}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        ))}

        {/* Filled and glowing data polygon */}
        <polygon
          points={dataPoints}
          fill={`${color}15`}
          stroke={color}
          strokeWidth="2.5"
          filter={`url(#glow-${glowColor})`}
          className="transition-all duration-1000 ease-out"
        />

        {/* Small circles on the vertices */}
        {data.map((d, idx) => {
          const { x, y } = getCoordinates(idx, d.value);
          return (
            <circle
              key={idx}
              cx={x}
              cy={y}
              r="4"
              fill="#ffffff"
              stroke={color}
              strokeWidth="2.5"
            />
          );
        })}

        {/* Corner labels */}
        {labelsList.map((label, idx) => (
          <text
            key={idx}
            x={label.x}
            y={label.y}
            textAnchor={label.textAnchor}
            dy={label.dy}
            fill="#94a3b8"
            fontSize="10"
            fontWeight="900"
            className="uppercase tracking-widest font-sans"
          >
            {label.text}
          </text>
        ))}
      </svg>
    </div>
  );
};

export default RadarChart;
