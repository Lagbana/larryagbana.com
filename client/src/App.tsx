import { useState } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./App.css";
import { NavBar } from "./components/NavBar/nav-bar";
import { Login } from "./components/Login/login";
import { CreateSpace } from "./components/Spaces/CreateSpace";
import { Space } from "./components/Spaces/Space";
import { AuthService } from "./services/AuthService";
import { DataService } from "./services/DataService";
import { AuthServiceContext } from "./hooks/useAuthService";
import { DataServiceContext } from "./hooks/useDataService";

const authService = new AuthService();
const dataService = new DataService(authService);

// TODO: (!) Some chunks are larger than 500 kBs after minification. Consider:
// - Using dynamic import() to code-split the application
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
          element: <Login setUserCb={setUsername} />,
        },
        {
          path: "/profile",
          element: <div>Profile page</div>,
        },
        {
          path: "/spaces",
          element: <Space />,
        },
        {
          path: "/create-spaces",
          element: <CreateSpace />,
        },
      ],
    },
  ]);

  return (
    <AuthServiceContext.Provider value={authService}>
      <DataServiceContext.Provider value={dataService}>
        <div className='App'>
          <RouterProvider router={router} />
        </div>
      </DataServiceContext.Provider>
    </AuthServiceContext.Provider>
  );
}

export default App;
