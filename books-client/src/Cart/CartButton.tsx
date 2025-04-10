// 🛒

import { useState } from "react";
import { Link } from "react-router";
import CartDetails from "./CartDetails";

type Props = {
  hover?: boolean;
};

const CartButton = ({ hover }: Props) => {
  const [showPreview, setShowPreview] = useState(false);

  function onHover() {
    if (!hover) return;
    setShowPreview(true);
  }

  function onHoverEnd() {
    if (!hover) return;
    setShowPreview(false);
  }

  return (
    <span onMouseEnter={onHover} onMouseLeave={onHoverEnd}>
      <Link to="/cart" className="inline w-[50px] h-[30px] cursor-pointer">
        Cart
      </Link>
      {showPreview && (
        <div
          className="absolute end-14 top-[36px] border subtle-background"
          onMouseEnter={onHover}
          onMouseLeave={onHoverEnd}
        >
          <CartDetails />
        </div>
      )}
    </span>
  );
};

export default CartButton;
