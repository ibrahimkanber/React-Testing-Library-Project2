import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import SummaryForm from "../SummaryForm";
import userEvent from "@testing-library/user-event";

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

  userEvent.click(checkbox);

  expect(checkbox).toBeChecked();

  expect(button).toBeEnabled();

  userEvent.click(checkbox);

  expect(checkbox).not.toBeChecked();

  expect(button).toBeDisabled();
});

test("popover responds to hover", async () => {
  render(<SummaryForm />);

  const nullPopover = screen.queryByText(
    /no ice cream will actually be delivered/i
  );
  expect(nullPopover).not.toBeInTheDocument();

  const termAndConditions = screen.getByText(/terms and conditions/i);

  userEvent.hover(termAndConditions);

  const popover = screen.getByText(/no ice cream will actually be delivered/i);

  expect(popover).toBeInTheDocument();

  userEvent.unhover(termAndConditions);

  await waitForElementToBeRemoved(() =>
    screen.queryByText(/no ice cream will actually be delivered/i)
  );

  //expect(nullPopoverAgain).not.toBeInTheDocument();
});
