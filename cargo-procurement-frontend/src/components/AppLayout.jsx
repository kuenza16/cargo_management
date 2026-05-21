import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Boxes,
  FileText,
  Home,
  LogOut,
  PackageCheck,
  Receipt,
  ShipWheel,
  Truck,
  Users,
  UserPlus,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const links = [
  ["Dashboard", "/dashboard", Home],
  ["Customers", "/customers", Users],
  ["Suppliers", "/suppliers", Boxes],
  ["Procurement", "/procurements", PackageCheck],
  ["Shipments", "/shipments", Truck],
  ["Invoices", "/invoices", Receipt],
  ["Expenses", "/expenses", FileText],
  ["User", "/users", UserPlus],
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="shell">
      <aside className="sidebar">
        <Link className="brand" to="/dashboard">
          <ShipWheel size={28} /> <span>Cargo ERP</span>
        </Link>
        <nav>
          {links.map(([label, path, Icon]) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `nav ${isActive ? "active" : ""}`}
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="main">
        <header className="topbar">
          <div>
            <strong>{user?.name}</strong>
            <span>{user?.role}</span>
          </div>
          <button
            className="btn ghost"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
