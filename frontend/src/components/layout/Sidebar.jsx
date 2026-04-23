import { NavLink } from "react-router-dom";
import { FiHome, FiUser, FiCreditCard, FiSettings, FiX } from "react-icons/fi";

const Sidebar = ({ isOpen, onClose }) => {
    const navItems = [
        { path: "/dashboard", icon: FiHome, label: "Dashboard" },
        { path: "/profile", icon: FiUser, label: "Profile" },
        { path: "/accounts-budgets", icon: FiCreditCard, label: "Accounts & Budgets" },
        { path: "/settings", icon: FiSettings, label: "Settings" },
    ];

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                }`}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
                    <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <FiX className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive
                                        ? "bg-primary-50 text-primary-600 font-medium"
                                        : "text-gray-700 hover:bg-gray-100"
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
