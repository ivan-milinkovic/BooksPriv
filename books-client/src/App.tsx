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

const queryClient = new QueryClient();

const Layout = () => {
  return (
    <div className="">
      <QueryClientProvider client={queryClient}>
        <Header />
        <div className="flex flex-col items-center">
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </div>
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
