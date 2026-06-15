import { useEffect } from 'react';

export default function Toast({ message, onClose }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-6 py-3 rounded-full shadow-lg font-label-md text-label-md font-bold flex items-center gap-2 z-50 animate-fade-in">
      <span className="material-symbols-outlined text-[20px]">check_circle</span>
      {message}
    </div>
  );
}
