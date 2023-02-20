export default function Tooltip({ message, children, position = "top" }) {
  const positions = {
    top: "bottom-full left-1/2 mb-1 -translate-x-1/2",
    bottom: "top-full left-1/2 mt-3 -translate-x-1/2",
    left: "right-full top-1/2 mr-2 -translate-y-1/2",
    right: "left-full top-1/2 ml-2 -translate-y-1/2",
  };
  return (
    <div className="group relative flex">
      {children}
      <span
        className={`absolute transition-all scale-0 group-hover:scale-100 whitespace-nowrap z-20 text-white bg-black py-[6px] px-4 text-sm font-semibold rounded ${positions[position]}`}
      >
        {message}
      </span>
    </div>
  );
}
