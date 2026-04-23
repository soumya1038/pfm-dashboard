const Button = ({
    children,
    onClick,
    type = "button",
    variant = "primary",
    size = "md",
    disabled = false,
    className = "",
    icon: Icon,
}) => {
    const baseClasses = "font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed";

    const variantClasses = {
        primary: "bg-primary-500 text-white hover:bg-primary-600 disabled:bg-gray-400 disabled:text-gray-200 shadow-sm",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 shadow-sm",
        danger: "bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-400 disabled:text-gray-200 shadow-sm",
        outline: "border-2 border-primary-500 text-primary-500 bg-white hover:bg-primary-50 disabled:border-gray-300 disabled:text-gray-300 disabled:bg-gray-50",
    };

    const sizeClasses = {
        sm: "px-3 py-2 text-sm min-h-[36px]",
        md: "px-4 py-2.5 text-base min-h-[42px]",
        lg: "px-6 py-3 text-lg min-h-[48px]",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        >
            {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
            <span className="whitespace-nowrap">{children}</span>
        </button>
    );
};

export default Button;
