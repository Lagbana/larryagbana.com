import { useState } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./App.css";
import { NavBar } from "./components/NavBar/nav-bar";
import { Login } from "./components/Login/login";
import { AuthService } from "./services/AuthService";
import { AuthServiceContext } from "./hooks/useAuthService";

function App() {
  const [username, setUsername] = useState("");
  const authService = new AuthService();
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
          element: <Login setUserCb={setUsername} />,
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
    <AuthServiceContext.Provider value={authService}>
      <div className='App'>
        <RouterProvider router={router} />
      </div>
    </AuthServiceContext.Provider>
  );
}

export default App;
