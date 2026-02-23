/**
 * Card Component
 * Reusable card container
 */

export default function Card({ 
  children, 
  title,
  action,
  padding = 'default',
  className = '' 
}) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm ${paddingClasses[padding]} ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
