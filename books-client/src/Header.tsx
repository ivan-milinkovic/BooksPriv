import { Link } from "react-router";
import CartButton from "./Cart/CartButton";

const Header = () => {
  const isLoggedIn = false;

  return (
    <header className="flex flex-row justify-between m-4">
      <span></span>
      <Link to="/" className="text-2xl">
        Books
      </Link>
      <div>
        {isLoggedIn ? (
          <>
            <Link to="/admin" className="">
              Admin
            </Link>
            <Link to="/" className="ms-2">
              Logout
            </Link>
          </>
        ) : (
          <>
            <span className="ms-2">
              <CartButton hover={true} />
            </span>
            <Link to="/login" className="ms-2">
              Login
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
