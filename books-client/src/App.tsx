import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import "./App.css";
import Header from "./Header";
import Admin from "./admin/Admin";
import Login from "./auth/Login";
import Dev from "./Dev";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import Loading from "./Loading";
import Books from "./books/Books";
import BookDetails from "./books/BookDetails";
import CartDetails from "./Cart/CartDetails";
import CartProvider from "./Cart/CartProvider";

const queryClient = new QueryClient();

const Layout = () => {
  return (
    <div className="">
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <Header />
          <div className="flex flex-col items-center">
            <Suspense fallback={<Loading />}>
              <Outlet />
            </Suspense>
          </div>
        </CartProvider>
      </QueryClientProvider>
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
          element: <Books />,
        },
        {
          path: "/books/:bookId",
          element: <BookDetails />,
        },
        {
          path: "/cart",
          element: <CartDetails />,
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
