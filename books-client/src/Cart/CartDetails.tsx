import useCart from "./useCart";

const CartDetails = () => {
  const cart = useCart();

  return (
    <div>
      <div className="text-2xl">Cart</div>
      <table className="table-auto border-separate border-spacing-2">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cart.cartState.books.map((b) => (
            <tr key={b.id} className="border">
              <td>{b.title}</td>
              <td>{b.price}</td>
              <td>
                <button
                  onClick={() => {
                    cart.removeFromCart(b.id);
                  }}
                  className="secondary-button"
                >
                  X
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td>Total</td>
            <td>{cart.cartState.total}</td>
          </tr>
        </tbody>
      </table>
      <button
        onClick={() => {
          confirm("€");
        }}
        className="primary-button"
      >
        Checkout
      </button>
      <div></div>
    </div>
  );
};

export default CartDetails;
