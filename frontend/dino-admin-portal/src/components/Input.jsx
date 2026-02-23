/**
 * Input Component
 * Reusable text input with label and validation
 */

export default function Input({
  label,
  error,
  helperText,
  required = false,
  className = '',
  ...props
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        className={`w-full px-4 py-2 border ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'
        } rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${className}`}
        {...props}
      />
      {helperText && !error && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
