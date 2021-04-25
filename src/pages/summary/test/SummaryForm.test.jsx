import { render, screen, fireEvent } from "@testing-library/react";
import SummaryForm from "../SummaryForm";

test("initial conditions", () => {
  render(<SummaryForm />);
  const checkbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });

  expect(checkbox).not.toBeChecked();

  const button = screen.getByRole("button", { name: /confirm order/i });

  expect(button).toBeDisabled();
});

test("Checkbox disables button on first click and enables on second click", () => {
  render(<SummaryForm />);

  const checkbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  const button = screen.getByRole("button", { name: /confirm order/i });

  fireEvent.click(checkbox);

  expect(checkbox).toBeChecked();

  expect(button).toBeEnabled();

  fireEvent.click(checkbox);

  expect(checkbox).not.toBeChecked();

  expect(button).toBeDisabled();
});
