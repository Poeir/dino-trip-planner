function TypeBadge({ label }) {
  return (
    <span className="bg-green-700 backdrop-blur-md text-white border border-white/30 px-3 py-1 rounded-full text-xs font-medium">
      {label.replaceAll("_", " ")}
    </span>
  );
}

export default TypeBadge;
