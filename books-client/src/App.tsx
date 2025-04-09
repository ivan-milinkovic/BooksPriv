import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import "./App.css";
import Header from "./Header";
import Admin from "./admin/Admin";
import Login from "./auth/Login";
import Dev from "./Dev";

const Layout = () => {
  return (
    <div className="">
      <Header />
      <div className="flex flex-col items-center">
        <Outlet />
      </div>
    </div>
  );
};

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "",
          element: <>Book list</>,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "admin",
          element: <Admin />,
        },
        {
          path: "dev",
          element: <Dev />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
