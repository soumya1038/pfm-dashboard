const Loader = ({ fullScreen = false, size = "md" }) => {
    const sizeClasses = {
        sm: "w-4 h-4 border-2",
        md: "w-8 h-8 border-3",
        lg: "w-12 h-12 border-4",
    };

    const spinner = (
        <div
            className={`${sizeClasses[size]} border-primary-500 border-t-transparent rounded-full animate-spin`}
        />
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
                {spinner}
            </div>
        );
    }

    return <div className="flex justify-center items-center p-4">{spinner}</div>;
};

export default Loader;
