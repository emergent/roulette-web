type ResultDisplayProps = {
  result: string | null;
  hasEnoughOptions: boolean;
};

export default function ResultDisplay({ result, hasEnoughOptions }: ResultDisplayProps) {
  return (
    <div className="result" aria-live="polite">
      {hasEnoughOptions
        ? result
          ? `結果: ${result}`
          : "結果はここに表示されます。"
        : "項目を2つ以上入力してください。"}
    </div>
  );
}
