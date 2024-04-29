interface HelpScreenProps {
  onClose: () => void;
}

function CoffeeScreen({ onClose }: HelpScreenProps) {
  return (
    <div className="fixed top-10 left-1/10 w-4/5  flex items-left justify-center bg-gray-500 bg-opacity-50 z-100">
      <div className="bg-blue-300 p-6 rounded-lg shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <p className="text-black text-left">
          Good luck on your exam! If this tool is useful, please consider buying
          me a coffee{" "}
          <a
            className="text-blue-600"
            href="https://buymeacoffee.com/fachai"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>{" "}
          to support my work. Thank you!
        </p>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default CoffeeScreen;
