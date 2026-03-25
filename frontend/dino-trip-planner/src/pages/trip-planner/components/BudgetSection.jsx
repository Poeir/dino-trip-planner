const budgets = [
  { id: "unlimited", label: "ไม่จำกัด", value: "unlimited" },
  { id: "budget", label: "ประหยัด", value: "budget" },
  { id: "standard", label: "กลางๆ", value: "standard" },
  { id: "luxury", label: "หรู", value: "luxury" },
];

export default function BudgetSection({ selectedBudget = "standard", onBudgetChange = () => {} }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
      <h2 className="font-semibold text-lg sm:text-xl text-gray-800 mb-4">Budget</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {budgets.map((b) => (
          <button
            key={b.id}
            onClick={() => onBudgetChange(b.value)}
            className={`border-2 rounded-xl py-3 text-sm sm:text-base transition-all duration-200 active:scale-95 font-medium ${
              selectedBudget === b.value
                ? "bg-green-700 text-white border-green-700"
                : "border-gray-300 text-gray-800 hover:bg-green-700 hover:text-white hover:border-green-500"
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
}
