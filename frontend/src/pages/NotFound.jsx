import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-sm text-gray-600">The page you requested does not exist.</p>
      <Link className="text-sm font-medium text-gray-900" to="/dashboard">
        Return to dashboard
      </Link>
    </section>
  );
};

export default NotFound;
