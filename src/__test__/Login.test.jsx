import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../pages/Login/Login";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

let mockIsAuthenticated = false;
const mockLoginRedirect = jest.fn();

jest.mock("@azure/msal-react", () => ({
  useIsAuthenticated: () => mockIsAuthenticated,
  useMsal: () => ({
    instance: {
      loginRedirect: mockLoginRedirect,
    },
  }),
}));

describe("Login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    mockIsAuthenticated = false;
  });

  test("renderiza formulario de login", () => {
    render(<Login />);

    expect(
        screen.getByRole("heading", { name: /iniciar sesión/i })
    ).toBeInTheDocument();

    expect(
        screen.getByPlaceholderText(/tuemail@ejemplo.com/i)
    ).toBeInTheDocument();

    expect(
        screen.getByPlaceholderText(/••••••••/)
    ).toBeInTheDocument();
    });

  test("login Microsoft normal guarda redirect '/' y llama loginRedirect", async () => {
    const user = userEvent.setup();
    render(<Login />);

    await user.click(
      screen.getByText(/iniciar sesión con microsoft/i)
    );

    expect(sessionStorage.getItem("postLoginRedirect")).toBe("/");
    expect(mockLoginRedirect).toHaveBeenCalledWith({
      redirectUri: "/",
    });
  });

  test("login Admin guarda redirect '/admin' y llama loginRedirect", async () => {
    const user = userEvent.setup();
    render(<Login />);

    await user.click(
      screen.getByText(/acceso al panel de administración/i)
    );

    expect(sessionStorage.getItem("postLoginRedirect")).toBe("/admin");
    expect(mockLoginRedirect).toHaveBeenCalledWith({
      redirectUri: "/",
    });
  });

  test("cuando isAuthenticated es true, navega al redirect guardado", async () => {
    sessionStorage.setItem("postLoginRedirect", "/admin");
    mockIsAuthenticated = true;

    render(<Login />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/admin");
    });

    expect(
      sessionStorage.getItem("postLoginRedirect")
    ).toBeNull();
  });

  test("cuando isAuthenticated es true y no hay redirect, navega a '/'", async () => {
    mockIsAuthenticated = true;

    render(<Login />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});