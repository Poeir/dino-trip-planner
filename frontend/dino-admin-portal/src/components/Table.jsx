/**
 * Table Component
 * Reusable table with header and body
 */

export default function Table({ 
  columns = [], 
  data = [], 
  onRowClick,
  className = '' 
}) {
  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={`px-6 py-3 text-${column.align || 'left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td 
                colSpan={columns.length} 
                className="px-6 py-8 text-center text-gray-500"
              >
                ไม่พบข้อมูล
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? 'hover:bg-gray-50 cursor-pointer' : 'hover:bg-gray-50'}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-6 py-4 whitespace-nowrap text-${column.align || 'left'}`}
                  >
                    {column.render ? column.render(row) : row[column.field]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
