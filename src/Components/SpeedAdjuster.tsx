import React from "react";

interface SpeedAdjusterProps {
  speed: number;
  onSpeedChange: (newSpeed: number) => void;
  disabled: boolean;
}

const SpeedAdjuster: React.FC<SpeedAdjusterProps> = ({
  speed,
  onSpeedChange,
  disabled,
}) => {
  return (
    <div className="relative flex items-center">
      <span className="mr-1 text-sm">Speed</span>
      <button
        onClick={() => onSpeedChange(Math.max(speed - 0.2, 1.0))}
        className={`relative flex items-center justify-center z-10 ${
          disabled ? "grayscale" : ""
        }`}
        disabled={disabled}
      >
        <span role="img" aria-label="Decrease Speed">
          🔽
        </span>
      </button>
      <p className="text-sm">{speed.toFixed(1)}</p>
      <button
        onClick={() => onSpeedChange(Math.min(speed + 0.2, 1.6))}
        className={`relative flex items-center justify-center z-10 ${
          disabled ? "grayscale" : ""
        }`}
        disabled={disabled}
      >
        <span role="img" aria-label="Increase Speed">
          🔼
        </span>
      </button>
    </div>
  );
};

export default SpeedAdjuster;
