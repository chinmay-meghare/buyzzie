import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white text-gray-800 px-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Page not found 😕</p>
      <Link to="/" className="text-blue-600 hover:underline text-sm">
        Go back home →
      </Link>
    </div>
  );
};

export default NotFound;
