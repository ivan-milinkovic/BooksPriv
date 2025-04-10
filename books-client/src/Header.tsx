import { Link } from "react-router";
import CartButton from "./Cart/CartButton";
import Logout from "./auth/Logout";
import { useUserInfo } from "./auth/useUserInfo";

const Header = () => {
  const userInfo = useUserInfo();
  const isLoggedIn: boolean = !!userInfo;

  return (
    <header className="flex flex-row justify-between m-4">
      <span></span>
      <Link to="/" className="text-2xl">
        Books
      </Link>
      <div>
        {isLoggedIn ? (
          <>
            <span>{userInfo?.email}</span>
            <Link to="/admin" className="">
              Admin
            </Link>
            <Logout />
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
