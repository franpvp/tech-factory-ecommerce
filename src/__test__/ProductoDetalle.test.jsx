import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductoDetalle from "../pages/Productos/ProductoDetalle";


jest.mock("../auth/authConfig", () => ({
  msalInstance: {
    getAllAccounts: jest.fn(() => []),
    acquireTokenSilent: jest.fn(),
    acquireTokenPopup: jest.fn()
  }
}));

jest.mock("../config/env", () => ({
  ENV: {
    TEST_MODE: true,
    SERVICE_PRODUCTOS: "http://fake-productos"
  }
}));

jest.mock("../components/Navbar/Navbar", () => () => (
  <div data-testid="navbar-mock">Navbar</div>
));

const mockAddToCart = jest.fn();

jest.mock("../context/CartContext", () => ({
  useCart: () => ({
    addToCart: mockAddToCart
  })
}));

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useParams: () => ({ id: "1" }),
  useNavigate: () => mockNavigate
}));

/* =========================
   TEST DATA
========================= */
const productoMock = {
  id: 1,
  nombre: "RTX 5090",
  descripcion: "Ultra alto rendimiento",
  precio: 1999999,
  imagenUrl: "img-main.jpg",
  imagenesExtras: ["img-1.jpg", "img-2.jpg"],
  idCategoria: 10,
  marca: "NVIDIA"
};

const relacionadosMock = [
  {
    id: 2,
    nombre: "RTX 5080",
    precio: 1599999,
    imagenUrl: "img-5080.jpg",
    idCategoria: 10
  }
];

beforeEach(() => {
  jest.clearAllMocks();

  global.fetch = jest.fn((url) => {
    if (url.endsWith("/1")) {
      return Promise.resolve({
        ok: true,
        json: async () => productoMock
      });
    }

    return Promise.resolve({
      ok: true,
      json: async () => relacionadosMock
    });
  });
});

describe("ProductoDetalle", () => {

  test("cambia imagen al hacer click en miniatura", async () => {
    const user = userEvent.setup();
    render(<ProductoDetalle />);

    const thumbs = await screen.findAllByRole("img");

    await user.click(thumbs[1]);

    expect(thumbs[1].className).toMatch(/ring-2/);
  });

  test("agrega producto al carrito", async () => {
    const user = userEvent.setup();
    render(<ProductoDetalle />);

    const btn = await screen.findByText(/agregar al carrito/i);
    await user.click(btn);

    expect(mockAddToCart).toHaveBeenCalledWith({
      idProducto: 1,
      nombre: "RTX 5090",
      precio: 1999999,
      imagenUrl: "img-main.jpg",
      cantidad: 1
    });
  });

  test("navega al carrito al comprar ahora", async () => {
    const user = userEvent.setup();
    render(<ProductoDetalle />);

    const btn = await screen.findByText(/comprar ahora/i);
    await user.click(btn);

    expect(mockNavigate).toHaveBeenCalledWith("/carrito");
  });
});