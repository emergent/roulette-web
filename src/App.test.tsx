import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders roulette heading and button", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "ルーレット" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "スタート" })).toBeInTheDocument();
    expect(screen.getByText("結果はここに表示されます。")).toBeInTheDocument();
  });

  it("allows editing options and collapsing the editor", () => {
    const { container } = render(<App />);

    const addButton = screen.getByRole("button", { name: "追加" });
    const initialInputs = screen.getAllByRole("textbox");

    fireEvent.click(addButton);
    expect(screen.getAllByRole("textbox")).toHaveLength(initialInputs.length + 1);

    const deleteButtons = screen.getAllByRole("button", { name: "削除" });
    fireEvent.click(deleteButtons[0]);
    expect(screen.getAllByRole("textbox")).toHaveLength(initialInputs.length);

    const collapseButton = screen.getByRole("button", { name: "項目編集を閉じる" });
    fireEvent.click(collapseButton);
    expect(container.querySelector(".editor")?.classList.contains("collapsed")).toBe(true);

    const expandButton = screen.getByRole("button", { name: "項目編集を開く" });
    fireEvent.click(expandButton);
    expect(container.querySelector(".editor")?.classList.contains("collapsed")).toBe(false);
  });
});
