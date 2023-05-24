import { NavLink } from "react-router-dom";

const NavItemStyle = {} as const;

export interface NavItemProp {
  name: string;
  path: string;
  isNew: boolean;
}

export function NavItem({ name, path, isNew = false }: NavItemProp) {
  return (
    <NavLink to={path} style={NavItemStyle}>
      <span>{name}</span>
      {isNew && <span>{"🎉"}</span>}
    </NavLink>
  );
}
