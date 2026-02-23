/**
 * Modal Component
 * Reusable modal dialog with backdrop
 */

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children,
  maxWidth = 'md',
  showCloseButton = true 
}) {
  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className={`bg-white rounded-lg ${widthClasses[maxWidth]} w-full p-6 max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none transition-colors"
            >
              ×
            </button>
          )}
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}
