/**
 * Checkbox Component
 * Reusable checkbox with label
 */

export default function Checkbox({ 
  label, 
  checked, 
  onChange,
  id,
  className = '',
  ...props 
}) {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        id={checkboxId}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500 cursor-pointer"
        {...props}
      />
      {label && (
        <label 
          htmlFor={checkboxId} 
          className="ml-2 text-sm text-gray-700 cursor-pointer select-none"
        >
          {label}
        </label>
      )}
    </div>
  );
}
