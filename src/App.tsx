import { useMemo, useRef, useState } from "react";

const options = ["寿司", "焼肉", "ラーメン", "カレー", "パスタ", "ピザ", "餃子", "サラダ"];

const spinDurationMs = 5200;
const minSpins = 5;
const maxSpins = 8;
const pointerAngle = 90;

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

export default function App() {
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const animationRef = useRef<number | null>(null);
  const rotationRef = useRef(0);

  const segmentAngle = 360 / options.length;

  const gradient = useMemo(() => {
    const colors = [
      "#ff7a7a",
      "#ffb347",
      "#ffe066",
      "#9be15d",
      "#6be6ff",
      "#7aa7ff",
      "#c77dff",
      "#ff9bd1",
    ];
    const slices = options.map((_, index) => {
      const start = index * segmentAngle;
      const end = start + segmentAngle;
      const color = colors[index % colors.length];
      return `${color} ${start}deg ${end}deg`;
    });
    return `conic-gradient(${slices.join(", ")})`;
  }, [segmentAngle]);

  const labels = useMemo(
    () =>
      options.map((label, index) => {
        const angle = index * segmentAngle + segmentAngle / 2;
        return { label, angle };
      }),
    [segmentAngle]
  );

  const stopAnimation = () => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const calculateResult = (finalRotation: number) => {
    const normalized = (pointerAngle - (finalRotation % 360) + 360) % 360;
    const index = Math.floor(normalized / segmentAngle) % options.length;
    return options[index];
  };

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResult(null);

    const extraSpins = Math.floor(Math.random() * (maxSpins - minSpins + 1)) + minSpins;
    const randomOffset = Math.random() * 360;
    const startRotation = rotationRef.current;
    const targetRotation = startRotation + extraSpins * 360 + randomOffset;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / spinDurationMs, 1);
      const eased = easeOutCubic(progress);
      const current = startRotation + (targetRotation - startRotation) * eased;

      rotationRef.current = current;
      setRotation(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        const winner = calculateResult(current);
        setResult(winner);
        setIsSpinning(false);
        stopAnimation();
      }
    };

    stopAnimation();
    animationRef.current = requestAnimationFrame(animate);
  };

  return (
    <div className="app">
      <header>
        <h1>ルーレット</h1>
        <p>ボタンを押すと、慣性のあるルーレットが回転します。</p>
      </header>

      <div className="wheel-area">
        <div className="pointer" aria-hidden="true" />
        <div
          className="wheel"
          style={{
            background: gradient,
            transform: `rotate(${rotation}deg)`,
          }}
        >
          {labels.map(({ label, angle }) => (
            <div
              key={label}
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

      <button type="button" className="spin-button" onClick={spin} disabled={isSpinning}>
        {isSpinning ? "回転中..." : "スタート"}
      </button>

      <div className="result" aria-live="polite">
        {result ? `結果: ${result}` : "結果はここに表示されます。"}
      </div>
    </div>
  );
}
