/**
 * Button Component
 * Reusable button with different variants
 */

const variants = {
  primary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-700',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  outline: 'border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 bg-white',
  ghost: 'text-emerald-600 hover:text-emerald-900 hover:bg-emerald-50',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  icon,
  disabled = false,
  as = 'button',
  className = '',
  ...props 
}) {
  const baseClasses = 'rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClasses = variants[variant] || variants.primary;
  const sizeClasses = sizes[size] || sizes.md;
  const widthClass = fullWidth ? 'w-full' : '';
  const combinedClassName = `${baseClasses} ${variantClasses} ${sizeClasses} ${widthClass} ${className} flex items-center justify-center gap-2`;
  
  // If rendering as anchor tag
  if (as === 'a') {
    return (
      <a
        className={combinedClassName}
        {...props}
      >
        {icon && <span>{icon}</span>}
        {children}
      </a>
    );
  }

  return (
    <button
      className={combinedClassName}
      disabled={disabled}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
