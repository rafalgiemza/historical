import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DatePickerDemo } from "./DatePickerDemo";

describe("DatePickerDemo", () => {
  it("renders an input with today's date", () => {
    render(<DatePickerDemo />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect((input as HTMLInputElement).value).not.toBe("");
  });

  it("updates date when user types a new value", async () => {
    const user = userEvent.setup();
    render(<DatePickerDemo />);
    const input = screen.getByRole("textbox") as HTMLInputElement;

    await user.clear(input);
    await user.type(input, "01/15/2025");
    input.blur();

    expect(input.value).toBe("01/15/2025");
  });

  it("opens calendar popup on input click", async () => {
    const user = userEvent.setup();
    render(<DatePickerDemo />);
    const input = screen.getByRole("textbox");

    await user.click(input);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
