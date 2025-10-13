import { TbArrowBack } from "react-icons/tb";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen bg-white px-4">
      <div className="text-center animate-fade-in">
        <h2 className="text-5xl font-extrabold text-indigo-700 italic mb-1 tracking-wide">
          hey!
        </h2>
        <p className="text-md text-indigo-700 mb-4 font-medium">
          What are you doing here?!
        </p>
        <h1 className="text-[9rem] sm:text-[12rem] font-extrabold text-red-600 drop-shadow-lg leading-none">
          404
        </h1>
        <p className="text-2xl text-gray-700 mt-4 font-semibold">Error Not Found</p>
        <p className="text-md text-gray-500 mt-2 max-w-md mx-auto">
          The request could not be understood or was missing required parameters.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 bg-white text-black border border-black px-6 py-2 rounded-full hover:bg-black hover:text-white transition-all duration-300 shadow-md"
        >
          <TbArrowBack className="text-lg" /> Dashboard
        </Link>
      </div>
    </div>
  );
}
