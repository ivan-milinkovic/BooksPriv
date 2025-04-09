// 🛒

import { Link } from "react-router";

const CartButton = () => {
  return (
    <Link to="/cart" className="inline w-[50px] h-[30px] cursor-pointer">
      Cart
    </Link>
  );
};

export default CartButton;
