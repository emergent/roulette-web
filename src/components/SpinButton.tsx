type SpinButtonProps = {
  isSpinning: boolean;
  onSpin: () => void;
};

export default function SpinButton({ isSpinning, onSpin }: SpinButtonProps) {
  return (
    <button type="button" className="spin-button" onClick={onSpin} disabled={isSpinning}>
      {isSpinning ? "回転中..." : "スタート"}
    </button>
  );
}
