import React, { useState, useRef, useEffect } from 'react';

interface PopoverProps {
  children: React.ReactNode;
  content: React.ReactNode;
}

const Popover: React.FC<PopoverProps> = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !triggerRef.current?.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block">
      <button
        ref={triggerRef}
        onClick={toggleVisibility}
        className="text-black rounded-full border-none px-2 py-2 cursor-pointer transition duration-200 hover:bg-gray-300 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={isVisible}
        aria-controls="popover-content"
      >
        {children}
      </button>
      {isVisible && (
        <div
          id="popover-content"
          ref={popoverRef}
          className="absolute top-full left-1/2 mt-2 bg-white border border-gray-300 shadow-lg rounded-md p-4 z-100 whitespace-nowrap"
          role="dialog"
          aria-modal="true"
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Popover;
