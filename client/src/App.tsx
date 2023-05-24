import { useState } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./App.css";
import { NavBar } from "./components/NavBar/nav-bar";

function App() {
  const [username, setUsername] = useState("");
  const router = createBrowserRouter([
    {
      element: (
        <>
          <NavBar username={username} />
          <Outlet />
        </>
      ),
      children: [
        {
          path: "/",
          element: <div>Hello world!</div>,
        },
        {
          path: "/login",
          element: <div>Login page</div>,
        },
        {
          path: "/profile",
          element: <div>Profile page</div>,
        },
        {
          path: "/spaces",
          element: <div>Spaces page</div>,
        },
        {
          path: "/create-spaces",
          element: <div>Create spaces page</div>,
        },
      ],
    },
  ]);

  return (
    <div className='App'>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
