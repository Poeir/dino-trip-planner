/**
 * Badge Component
 * Reusable badge for statuses and tags
 */

const variants = {
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  emerald: 'bg-emerald-100 text-emerald-800',
  gray: 'bg-gray-100 text-gray-700',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export default function Badge({ 
  children, 
  variant = 'emerald', 
  size = 'md',
  rounded = 'full',
  className = '' 
}) {
  const baseClasses = 'inline-flex items-center font-medium';
  const variantClasses = variants[variant] || variants.emerald;
  const sizeClasses = sizes[size] || sizes.md;
  const roundedClass = rounded === 'full' ? 'rounded-full' : 'rounded';
  
  return (
    <span className={`${baseClasses} ${variantClasses} ${sizeClasses} ${roundedClass} ${className}`}>
      {children}
    </span>
  );
}
