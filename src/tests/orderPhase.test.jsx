import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "../App";

test("order phases for happy path", async () => {
  //render App
  render(<App />);
  //add ice creap scoops and toppings

  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });

  userEvent.clear(vanillaInput);
  userEvent.type(vanillaInput, "1");
  const chocolateInput = screen.getByRole("spinbutton", { name: "Chocolate" });
  userEvent.clear(chocolateInput);
  userEvent.type(chocolateInput, "2");

  const cherriesCheckbox = await screen.findByRole("checkbox", {
    name: "Cherries",
  });

  userEvent.click(cherriesCheckbox);

  //find and click order button
  const orderSummaryButton = screen.getByRole("button", {
    name: /order sundae/i,
  });

  userEvent.click(orderSummaryButton);
  //check summary information based on order

  const summaryHeading = screen.getByRole("heading", { name: "Order Summary" });
  expect(summaryHeading).toBeInTheDocument();

  const scoopsHeading = screen.getByRole("heading", { name: "Scoops: $6.00" });
  expect(scoopsHeading).toBeInTheDocument();

  const toppingsHeading = screen.getByRole("heading", {
    name: "Toppings: $1.50",
  });
  expect(toppingsHeading).toBeInTheDocument();

  //check summary optionitems
  expect(screen.getByText("1 Vanilla")).toBeInTheDocument();
  expect(screen.getByText("2 Chocolate")).toBeInTheDocument();
  expect(screen.getByText("Cherries")).toBeInTheDocument();

  //accept terms and conditions and click button to confirm order

  const checkbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });

  userEvent.click(checkbox);

  const confirmButton = screen.getByRole("button", { name: /confirm order/i });

  userEvent.click(confirmButton);

  //Expect "loading" to show

  const loading = screen.getByText(/loading/i);
  expect(loading).toBeInTheDocument();

  //confirm order number on confirmation page

  const thankTouHeader = await screen.findByRole("heading", {
    name: /thank you!/i,
  });

  expect(thankTouHeader).toBeInTheDocument();

  //expect that loading has disappeared

  const notLoading = screen.queryByText("loading");
  expect(notLoading).not.toBeInTheDocument();

  const orderNumber = await screen.findByText(/order number/i);

  expect(orderNumber).toBeInTheDocument();

  //click new order button on confirmation page
  const newOrderButton = screen.getByText(/new order/i);

  userEvent.click(newOrderButton);

  //check that scoops and toppings subtotal have been reset

  const scoopsTotal = screen.getByText("Scoops total: $0.00");

  expect(scoopsTotal).toBeInTheDocument();

  const toppingsTotal = screen.getByText("Toppings total: $0.00");

  expect(toppingsTotal).toBeInTheDocument();

  //do we need to await anything to avoid test errors?

  await screen.findByRole("spinbutton", { name: "Vanilla" });
  await screen.findByRole("checkbox", { name: "Cherries" });
});

test("Toppings header is not on summary page if no toppings ordered", async () => {
  render(<App />);

  //add ice cream scoops and toppings
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });

  userEvent.clear(vanillaInput);
  userEvent.type(vanillaInput, "1");

  const chocolateInput = screen.getByRole("spinbutton", { name: "Chocolate" });
  userEvent.clear(chocolateInput);
  userEvent.type(chocolateInput, "2");

  //find and click order summary button

  const orderSummaryButton = screen.getByRole("button", {
    name: /order sundae/i,
  });

  userEvent.click(orderSummaryButton);

  const scoopsHeading = screen.getByRole("heading", { name: "Scoops: $6.00" });

  expect(scoopsHeading).toBeInTheDocument();

  const toppingsHeading = screen.queryByRole("heading", { name: /toppings/i });

  expect(toppingsHeading).not.toBeInTheDocument();
});
