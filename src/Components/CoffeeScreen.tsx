interface HelpScreenProps {
  onClose: () => void;
}

function CoffeeScreen({ onClose }: HelpScreenProps) {
  return (
    <div className="fixed top-10 left-1/10 w-4/5  flex items-left justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-blue-300 p-6 rounded-lg shadow-xl">
        <p className="text-black text-left">
          Good luck on your exam!! If this tool is useful, please consider
          buying me a coffee{" "}
          <a className="text-blue-600" href="http://www.buymeacoffee.com">
            here
          </a>{" "}
          to support my work. Appreciate it!
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
