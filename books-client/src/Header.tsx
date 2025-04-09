import { Link } from "react-router";

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
          <Link to="/login" className="">
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
