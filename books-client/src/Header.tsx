import { Link } from "react-router";
import CartButton from "./cart/CartButton";
import Logout from "./auth/Logout";
import { useUserInfo } from "./auth/useUserInfo";

const Header = () => {
  const userInfo = useUserInfo();
  const isLoggedIn: boolean = !userInfo.isGuest;

  return (
    <header className="flex flex-row justify-between m-4">
      <span></span>
      <Link to="/" className="text-2xl">
        Books
      </Link>
      <div className="flex flex-row gap-2 items-baseline">
        {isLoggedIn ? (
          <>
            <span>{userInfo?.email}</span>
            <span className="link">
              <CartButton hover={true} />
            </span>
            <Link to="/admin" className="link">
              Admin
            </Link>
            <span className="">
              <Logout />
            </span>
          </>
        ) : (
          <>
            <span className="link">
              <CartButton hover={true} />
            </span>
            <Link to="/login" className="link">
              Login
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
