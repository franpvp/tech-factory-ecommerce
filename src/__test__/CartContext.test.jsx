import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider, useCart } from '../context/CartContext';

const TestConsumer = () => {
  const {
    cart,
    addToCart,
    deleteFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    cartCount,
    total,
    carritoId,
    setCarritoId,
    listaDetalle
  } = useCart();

  return (
    <div>
      <span data-testid="cart-count">{cartCount}</span>
      <span data-testid="total">{total}</span>
      <span data-testid="carrito-id">{String(carritoId)}</span>

      <button onClick={() => addToCart({ idProducto: 1, nombre: 'GPU', precio: 100 })}>
        add
      </button>

      <button onClick={() => increaseQuantity(1)}>+</button>
      <button onClick={() => decreaseQuantity(1)}>-</button>
      <button onClick={() => deleteFromCart(1)}>delete</button>
      <button onClick={clearCart}>clear</button>

      <button onClick={() => setCarritoId(99)}>setCarritoId</button>

      <pre data-testid="lista-detalle">
        {JSON.stringify(listaDetalle)}
      </pre>

      <pre data-testid="cart">
        {JSON.stringify(cart)}
      </pre>
    </div>
  );
};

describe('CartContext', () => {

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('inicia con carrito vacío', () => {
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );

    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
    expect(screen.getByTestId('total')).toHaveTextContent('0');
  });

  test('agrega un producto al carrito', async () => {
    const user = userEvent.setup();

    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );

    await user.click(screen.getByText('add'));

    expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
    expect(screen.getByTestId('total')).toHaveTextContent('100');
  });

  test('incrementa la cantidad de un producto', async () => {
    const user = userEvent.setup();

    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );

    await user.click(screen.getByText('add'));
    await user.click(screen.getByText('+'));

    expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
    expect(screen.getByTestId('total')).toHaveTextContent('200');
  });

  test('disminuye la cantidad sin bajar de 1', async () => {
    const user = userEvent.setup();

    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );

    await user.click(screen.getByText('add'));
    await user.click(screen.getByText('-'));

    expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
  });

  test('elimina un producto del carrito', async () => {
    const user = userEvent.setup();

    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );

    await user.click(screen.getByText('add'));
    await user.click(screen.getByText('delete'));

    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
    expect(screen.getByTestId('total')).toHaveTextContent('0');
  });

  test('vacía completamente el carrito', async () => {
    const user = userEvent.setup();

    render(
        <CartProvider>
        <TestConsumer />
        </CartProvider>
    );

    await user.click(screen.getByText('add'));
    await user.click(screen.getByText('clear'));

    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
    expect(localStorage.getItem('cart')).toBe('[]');
    });

  test('guarda y recupera carrito desde localStorage', () => {
    localStorage.setItem(
      'cart',
      JSON.stringify([{ idProducto: 1, cantidad: 2, precio: 50 }])
    );

    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );

    expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
    expect(screen.getByTestId('total')).toHaveTextContent('100');
  });

  test('calcula correctamente listaDetalle', async () => {
    const user = userEvent.setup();

    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );

    await user.click(screen.getByText('add'));

    expect(screen.getByTestId('lista-detalle')).toHaveTextContent(
      JSON.stringify([{ idProducto: 1, cantidad: 1 }])
    );
  });

  test('maneja carritoId y lo persiste', async () => {
    const user = userEvent.setup();

    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );

    await user.click(screen.getByText('setCarritoId'));

    expect(screen.getByTestId('carrito-id')).toHaveTextContent('99');
    expect(localStorage.getItem('carritoId')).toBe('99');
  });

});