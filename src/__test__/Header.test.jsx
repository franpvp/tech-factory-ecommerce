import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '../components/Header/Header';

describe('Header', () => {

  test('renderiza la barra superior correctamente', () => {
    render(<Header onToggleSidebar={jest.fn()} />);

    expect(
      screen.getByRole('banner', { name: /barra superior/i })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/search/i)
    ).toBeInTheDocument();
  });

  test('ejecuta onToggleSidebar al hacer click en el botón del menú', async () => {
    const user = userEvent.setup();
    const onToggleSidebarMock = jest.fn();

    render(<Header onToggleSidebar={onToggleSidebarMock} />);

    const toggleButton = screen.getByRole('button', {
      name: /alternar menú lateral/i
    });

    await user.click(toggleButton);

    expect(onToggleSidebarMock).toHaveBeenCalledTimes(1);
  });

  test('activa pantalla completa cuando no está en fullscreen', async () => {
    const user = userEvent.setup();

    document.documentElement.requestFullscreen = jest.fn();
    document.exitFullscreen = jest.fn();
    Object.defineProperty(document, 'fullscreenElement', {
      value: null,
      writable: true
    });

    render(<Header onToggleSidebar={jest.fn()} />);

    const fullscreenButton = screen.getByRole('button', {
      name: /pantalla completa/i
    });

    await user.click(fullscreenButton);

    expect(document.documentElement.requestFullscreen).toHaveBeenCalled();
  });

  test('sale de pantalla completa si ya está activa', async () => {
    const user = userEvent.setup();

    document.documentElement.requestFullscreen = jest.fn();
    document.exitFullscreen = jest.fn();
    Object.defineProperty(document, 'fullscreenElement', {
      value: {}
    });

    render(<Header onToggleSidebar={jest.fn()} />);

    const fullscreenButton = screen.getByRole('button', {
      name: /pantalla completa/i
    });

    await user.click(fullscreenButton);

    expect(document.exitFullscreen).toHaveBeenCalled();
  });

});