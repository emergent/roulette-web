type OptionItem = {
  id: string;
  label: string;
};

type OptionEditorProps = {
  options: OptionItem[];
  isSpinning: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
  onChangeOption: (index: number, value: string) => void;
};

export default function OptionEditor({
  options,
  isSpinning,
  isCollapsed,
  onToggleCollapse,
  onAddOption,
  onRemoveOption,
  onChangeOption,
}: OptionEditorProps) {
  return (
    <section className={isCollapsed ? "editor collapsed" : "editor"}>
      <button
        type="button"
        className="collapse-button"
        onClick={onToggleCollapse}
        aria-label={isCollapsed ? "項目編集を開く" : "項目編集を閉じる"}
      >
        {isCollapsed ? "+" : "−"}
      </button>
      <div className="editor-content">
        <h2>項目編集</h2>
        <p>ルーレットの項目を自由に編集できます。</p>
        <div className="editor-list">
          {options.map((option, index) => (
            <div key={option.id} className="editor-row">
              <input
                type="text"
                value={option.label}
                onChange={(event) => onChangeOption(index, event.target.value)}
                placeholder={`項目${index + 1}`}
                disabled={isSpinning}
              />
              <button
                type="button"
                onClick={() => onRemoveOption(index)}
                disabled={isSpinning || options.length <= 2}
              >
                削除
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="add-button" onClick={onAddOption} disabled={isSpinning}>
          追加
        </button>
      </div>
    </section>
  );
}
