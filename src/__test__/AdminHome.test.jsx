import { render, screen, waitFor } from "@testing-library/react";
import AdminHome from "../pages/Admin/Home/AdminHome";
import { fetchDashboardMetrics } from "../services/fetchDashboardMetrics";

jest.mock("../services/fetchDashboardMetrics", () => ({
  fetchDashboardMetrics: jest.fn(),
}));

jest.mock("../pages/Dashboard/Cards/DashboardCards", () => ({
  DashboardCards: ({ usuariosActivos, ventasCorrectas, ordenesHoy }) => (
    <div data-testid="dashboard-cards">
      <span data-testid="activos">{usuariosActivos}</span>
      <span data-testid="correctas">{ventasCorrectas}</span>
      <span data-testid="ordenes-hoy">{ordenesHoy}</span>
    </div>
  ),
}));

jest.mock("../pages/Dashboard/Graficos/OrdenesPieChart", () => ({
  OrdenesPieChart: ({ data }) => (
    <div data-testid="ordenes-pie-chart">{JSON.stringify(data)}</div>
  ),
}));

describe("AdminHome", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("muestra mensaje de carga inicialmente", () => {
    fetchDashboardMetrics.mockResolvedValueOnce(null);

    render(<AdminHome />);

    expect(
      screen.getByText(/cargando métricas/i)
    ).toBeInTheDocument();
  });

  test("llama a fetchDashboardMetrics al montar", async () => {
    fetchDashboardMetrics.mockResolvedValueOnce({
      activos: 10,
      correctas: 5,
      ordenesHoy: 3,
    });

    render(<AdminHome />);

    await waitFor(() => {
      expect(fetchDashboardMetrics).toHaveBeenCalledTimes(1);
    });
  });

  test("renderiza título y subtítulo cuando hay métricas", async () => {
    fetchDashboardMetrics.mockResolvedValueOnce({
      activos: 20,
      correctas: 12,
      ordenesHoy: 6,
    });

    render(<AdminHome />);

    expect(
      await screen.findByText(/panel de administración/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/resumen de la actividad del sistema/i)
    ).toBeInTheDocument();
  });

  test("renderiza DashboardCards con props correctas", async () => {
    fetchDashboardMetrics.mockResolvedValueOnce({
      activos: 7,
      correctas: 4,
      ordenesHoy: 2,
    });

    render(<AdminHome />);

    const cards = await screen.findByTestId("dashboard-cards");

    expect(cards).toBeInTheDocument();
    expect(screen.getByTestId("activos")).toHaveTextContent("7");
    expect(screen.getByTestId("correctas")).toHaveTextContent("4");
    expect(screen.getByTestId("ordenes-hoy")).toHaveTextContent("2");
  });

  test("renderiza OrdenesPieChart con data correcta", async () => {
    fetchDashboardMetrics.mockResolvedValueOnce({
      activos: 15,
      correctas: 9,
      ordenesHoy: 5,
    });

    render(<AdminHome />);

    const chart = await screen.findByTestId("ordenes-pie-chart");

    expect(chart).toBeInTheDocument();
    expect(chart).toHaveTextContent("5");
  });
});