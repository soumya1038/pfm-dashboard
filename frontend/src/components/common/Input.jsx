const Input = ({
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    error,
    required = false,
    disabled = false,
    className = "",
}) => {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            {label && (
                <label htmlFor={name} className="text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                    error ? "border-red-500" : "border-gray-300"
                } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
            />
            {error && <span className="text-sm text-red-500">{error}</span>}
        </div>
    );
};

export default Input;
