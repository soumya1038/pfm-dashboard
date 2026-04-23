import { FiMenu, FiLogOut, FiUser } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { getInitials } from "../../utils/formatters";

const Navbar = ({ onToggleSidebar }) => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-4">
                <button
                    onClick={onToggleSidebar}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
                >
                    <FiMenu className="w-5 h-5 text-gray-600" />
                </button>
                <h1 className="text-xl font-bold text-primary-600">PFM Dashboard</h1>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                        {user?.profilePicture ? (
                            <img
                                src={user.profilePicture}
                                alt={user.name}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            getInitials(user?.name)
                        )}
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">
                        {user?.name}
                    </span>
                </div>

                <button
                    onClick={logout}
                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors flex items-center gap-2"
                    title="Logout"
                >
                    <FiLogOut className="w-5 h-5" />
                    <span className="text-sm font-medium hidden sm:block">Logout</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
