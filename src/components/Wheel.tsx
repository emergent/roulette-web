type WheelLabel = {
  id: string;
  label: string;
  angle: number;
};

type WheelProps = {
  gradient: string;
  rotation: number;
  labels: WheelLabel[];
};

export default function Wheel({ gradient, rotation, labels }: WheelProps) {
  return (
    <div className="wheel-area">
      <div className="pointer" aria-hidden="true" />
      <div
        className="wheel"
        style={{
          background: gradient,
          transform: `rotate(${rotation}deg)`,
        }}
      >
        {labels.map(({ id, label, angle }) => (
          <div
            key={id}
            className="wheel-label"
            style={{
              transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(calc(var(--wheel-size) * -0.36))`,
            }}
          >
            <span style={{ transform: "rotate(-90deg)" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
