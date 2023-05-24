import { NavLink } from "react-router-dom";
import { NavItem } from "./nav-items";
import type { NavItemProp } from "./nav-items";

const navItems: Array<NavItemProp> = [
  {
    path: "/",
    name: "Home",
    isNew: false,
  },
  {
    path: "/profile",
    name: "Profile",
    isNew: false,
  },
  {
    path: "/spaces",
    name: "Spaces",
    isNew: false,
  },
  {
    path: "/create-spaces",
    name: "Create space",
    isNew: true,
  },
];

interface NavBarProps {
  username?: string;
}
export function NavBar({ username }: NavBarProps) {
  function renderAuthItem(username?: string) {
    if (username) {
      return (
        <NavLink to='/logout' style={{ float: "right" }}>
          {username}
        </NavLink>
      );
    } else {
      return (
        <NavLink to='/login' style={{ float: "right" }}>
          {"Login"}
        </NavLink>
      );
    }
  }
  return (
    <div className='navbar'>
      {navItems.map((items, index) => {
        return (
          <div key={`${items.name}-${index}`}>
            <NavItem path={items.path} name={items.name} isNew={items.isNew} />
          </div>
        );
      })}
      {renderAuthItem(username)}
    </div>
  );
}
