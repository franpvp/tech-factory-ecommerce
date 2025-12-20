jest.mock("../auth/authConfig");

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminCategorias from "../pages/Admin/Categorias/AdminCategorias";

jest.mock("../services/CategoriasService", () => ({
    getCategorias: jest.fn(),
    createCategoria: jest.fn(),
    updateCategoria: jest.fn(),
    deleteCategoria: jest.fn(),
}));

import {
    getCategorias,
    createCategoria,
    deleteCategoria,
} from "../services/CategoriasService";

describe("AdminCategorias", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

  test("abre modal de creación", async () => {
    getCategorias.mockResolvedValueOnce([]);

    const user = userEvent.setup();
    render(<AdminCategorias />);

    const openButton = screen.getByRole("button", {
      name: /nueva categoría/i,
    });

    await user.click(openButton);

    expect(
      screen.getByRole("heading", { name: /nueva categoría/i })
    ).toBeInTheDocument();
  });

  test("crea una categoría", async () => {
    getCategorias.mockResolvedValueOnce([]);

    createCategoria.mockResolvedValueOnce({
      id: 1,
      nombre: "Procesadores",
      descripcion: "CPU",
      nombreDirectorio: "procesadores-img/",
    });

    const user = userEvent.setup();
    render(<AdminCategorias />);

    await user.click(
      screen.getByRole("button", { name: /nueva categoría/i })
    );

    const inputs = screen.getAllByRole("textbox");

    await user.type(inputs[0], "Procesadores");
    await user.type(inputs[1], "CPU");

    await user.selectOptions(
      screen.getByRole("combobox"),
      "procesadores-img/"
    );

    await user.click(screen.getByRole("button", { name: /guardar/i }));

    await waitFor(() => {
      expect(createCategoria).toHaveBeenCalled();
      expect(screen.getByText("Procesadores")).toBeInTheDocument();
    });
  });

  test("elimina una categoría", async () => {
    window.confirm = jest.fn(() => true);

    getCategorias.mockResolvedValueOnce([
        {
        id: 1,
        nombre: "GPU",
        descripcion: "Tarjetas",
        nombreDirectorio: "tarjetas-graficas-img/",
        },
    ]);

    deleteCategoria.mockResolvedValueOnce(true);

    const user = userEvent.setup();
    render(<AdminCategorias />);

    const row = await screen.findByText("GPU");
    const tr = row.closest("tr");

    const buttons = tr.querySelectorAll("button");

    await user.click(buttons[1]);

    await waitFor(() => {
        expect(deleteCategoria).toHaveBeenCalledWith(1);
    });
    });
});