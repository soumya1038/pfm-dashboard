import { NavLink, Outlet } from "react-router-dom";

const linkClass = ({ isActive }) =>
  isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-800";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="text-lg font-semibold">PFM Dashboard</div>
          <nav className="flex gap-4 text-sm">
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/login" className={linkClass}>
              Login
            </NavLink>
            <NavLink to="/register" className={linkClass}>
              Register
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
