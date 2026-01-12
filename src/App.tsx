import { useMemo, useRef, useState } from "react";
import AppHeader from "./components/AppHeader";
import OptionEditor from "./components/OptionEditor";
import ResultDisplay from "./components/ResultDisplay";
import SpinButton from "./components/SpinButton";
import Wheel from "./components/Wheel";

type RouletteOption = {
  id: string;
  label: string;
};

const createOption = (label: string): RouletteOption => ({
  id: crypto.randomUUID(),
  label,
});

const initialOptions = [
  "寿司",
  "焼肉",
  "ラーメン",
  "カレー",
  "パスタ",
  "ピザ",
  "餃子",
  "サラダ",
].map(createOption);

const spinDurationMs = 5200;
const minSpins = 5;
const maxSpins = 8;
const pointerAngle = 90;

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

export default function App() {
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [options, setOptions] = useState<RouletteOption[]>(initialOptions);
  const [isEditorCollapsed, setIsEditorCollapsed] = useState(false);
  const animationRef = useRef<number | null>(null);
  const rotationRef = useRef(0);

  const displayOptions = useMemo(
    () =>
      options.map((option, index) => ({
        ...option,
        label: option.label.trim() || `項目${index + 1}`,
      })),
    [options]
  );

  const segmentAngle = displayOptions.length > 0 ? 360 / displayOptions.length : 0;

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
    const slices = displayOptions.map((_, index) => {
      const start = index * segmentAngle;
      const end = start + segmentAngle;
      const color = colors[index % colors.length];
      return `${color} ${start}deg ${end}deg`;
    });
    return `conic-gradient(${slices.join(", ")})`;
  }, [displayOptions, segmentAngle]);

  const labels = useMemo(
    () =>
      displayOptions.map((option, index) => {
        const angle = index * segmentAngle + segmentAngle / 2;
        return { ...option, angle };
      }),
    [displayOptions, segmentAngle]
  );

  const stopAnimation = () => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const calculateResult = (finalRotation: number) => {
    const normalized = (pointerAngle - (finalRotation % 360) + 360) % 360;
    if (segmentAngle === 0) return "";
    const index = Math.floor(normalized / segmentAngle) % displayOptions.length;
    return displayOptions[index].label;
  };

  const spin = () => {
    if (isSpinning || displayOptions.length < 2) return;
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
      <AppHeader />

      <div className="content">
        <Wheel gradient={gradient} rotation={rotation} labels={labels} />
        <OptionEditor
          options={options}
          isSpinning={isSpinning}
          isCollapsed={isEditorCollapsed}
          onToggleCollapse={() => setIsEditorCollapsed((prev) => !prev)}
          onAddOption={() => {
            setOptions((current) => [...current, createOption("")]);
            setResult(null);
          }}
          onRemoveOption={(index) => {
            if (options.length <= 2) return;
            setOptions((current) => current.filter((_, optionIndex) => optionIndex !== index));
            setResult(null);
          }}
          onChangeOption={(index, value) => {
            setOptions((current) => {
              const next = [...current];
              next[index] = { ...next[index], label: value };
              return next;
            });
            setResult(null);
          }}
        />
      </div>

      <SpinButton isSpinning={isSpinning} onSpin={spin} />
      <ResultDisplay result={result} hasEnoughOptions={displayOptions.length >= 2} />
    </div>
  );
}
