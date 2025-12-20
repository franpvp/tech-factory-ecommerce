import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pagos from "../pages/Pagos/Pagos";

jest.mock("../config/env", () => ({
  ENV: {
    TEST_MODE: true,
    SERVICE_CLIENTES: "http://fake-clientes",
    SERVICE_ORDENES: "http://fake-ordenes"
  }
}));

jest.mock("../components/Navbar/Navbar", () => () => (
  <div data-testid="navbar-mock">Navbar</div>
));

jest.mock("../components/Loading/PaymentLoading", () => () => (
  <div data-testid="payment-loading">Procesando pago...</div>
));

jest.mock("../context/CartContext", () => ({
  useCart: () => ({
    cart: [
      {
        idProducto: 1,
        nombre: "Producto Test",
        precio: 10000,
        cantidad: 1
      }
    ],
    listaDetalle: [{ idProducto: 1, cantidad: 1 }]
  })
}));

jest.mock("@azure/msal-react", () => ({
  useMsal: () => ({
    instance: {
      acquireTokenSilent: jest.fn(),
      acquireTokenPopup: jest.fn()
    },
    accounts: [{ username: "qa@test.com" }]
  })
}));

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: null })
}));


global.fetch = jest.fn();

describe("Pagos", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    localStorage.setItem(
        "despacho",
        JSON.stringify({ direccion: "Test 123", ciudad: "Santiago" })
    );

    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 99 })
    });
    });

  test("renderiza formulario de pago y navbar", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 99 })
    });

    render(<Pagos />);

    expect(screen.getByTestId("navbar-mock")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: /métodos de pago/i })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/1234 5678 9012 3456/i)
    ).toBeInTheDocument();
  });

  test("valida campos obligatorios al intentar pagar vacío", async () => {
    const user = userEvent.setup();

    render(<Pagos />);

    await user.click(screen.getByTestId("accept-pay-btn"));

    expect(
      await screen.findByText(/el número de tarjeta es obligatorio/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/el nombre del titular es obligatorio/i)
    ).toBeInTheDocument();
  });

});