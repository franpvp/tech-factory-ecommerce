import { render, screen } from '@testing-library/react';
import PaymentLoading from '../components/Loading/PaymentLoading';

describe('PaymentLoading', () => {

  test('renderiza el mensaje de procesamiento de pago', () => {
    render(<PaymentLoading />);

    expect(
      screen.getByText(/procesando pago/i)
    ).toBeInTheDocument();
  });

  test('muestra el mensaje de advertencia al usuario', () => {
    render(<PaymentLoading />);

    expect(
      screen.getByText(/no cierres ni recargues esta ventana/i)
    ).toBeInTheDocument();
  });

  test('renderiza el loader visual', () => {
    const { container } = render(<PaymentLoading />);

    const loader = container.querySelector('.loader');
    expect(loader).toBeInTheDocument();
  });

});