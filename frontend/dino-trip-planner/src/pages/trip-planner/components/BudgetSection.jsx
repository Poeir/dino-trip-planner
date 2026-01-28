const budgets = ["ไม่จำกัด", "ประหยัด", "กลางๆ", "หรู"];

export default function BudgetSection() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
      <h2 className="font-semibold text-lg sm:text-xl text-gray-800 mb-4">Budget</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {budgets.map((b) => (
          <button
            key={b}
            className="border-2 border-gray-300 rounded-xl py-3 text-sm sm:text-base hover:bg-green-700 hover:text-white hover:border-green-500 transition-all duration-200 active:scale-95 font-medium"
          >
            {b}
          </button>
        ))}
      </div>
    </div>
  );
}
