import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PagoFallido from "../pages/PagoFallido/PagoFallido";

jest.mock("../components/Navbar/Navbar", () => () => (
  <div data-testid="navbar-mock">Navbar</div>
));

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    state: null
  })
}));

describe("PagoFallido", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza mensaje de pago rechazado y navbar", () => {
    render(<PagoFallido />);

    expect(screen.getByTestId("navbar-mock")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: /pago rechazado/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/tu pago no pudo completarse/i)
    ).toBeInTheDocument();
  });

  test("navega a reintentar pago", async () => {
    const user = userEvent.setup();

    render(<PagoFallido />);

    await user.click(
      screen.getByRole("button", { name: /reintentar pago/i })
    );

    expect(mockNavigate).toHaveBeenCalledWith("/metodo-pago");
  });

  test("navega al carrito", async () => {
    const user = userEvent.setup();

    render(<PagoFallido />);

    await user.click(
      screen.getByRole("button", { name: /ir al carrito/i })
    );

    expect(mockNavigate).toHaveBeenCalledWith("/carrito");
  });

  test("navega al inicio", async () => {
    const user = userEvent.setup();

    render(<PagoFallido />);

    await user.click(
      screen.getByRole("button", { name: /volver al inicio/i })
    );

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("muestra mensaje personalizado si viene en location.state", () => {
    jest.doMock("react-router-dom", () => ({
      useNavigate: () => mockNavigate,
      useLocation: () => ({
        state: { reason: "Fondos insuficientes" }
      })
    }));

    const PagoFallidoWithState =
      require("../pages/PagoFallido/PagoFallido").default;

    render(<PagoFallidoWithState />);

    expect(
      screen.getByText(/fondos insuficientes/i)
    ).toBeInTheDocument();
  });
});